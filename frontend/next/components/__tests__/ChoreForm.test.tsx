import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ChoreForm from '../chores/ChoreForm';
import { format } from 'date-fns';
import { Chore } from '@/types/chores';
import { Dialog } from '@/components/ui/dialog';

// Mock ResizeObserver before tests run
class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

global.ResizeObserver = ResizeObserverMock;

// Mock UI components that cause issues in tests
jest.mock('@/components/ui/dialog', () => {
  return {
    Dialog: ({
      children,
      open,
    }: {
      children: React.ReactNode;
      open?: boolean;
    }) => <div data-testid='dialog'>{open ? children : null}</div>,
    DialogContent: ({ children }: { children: React.ReactNode }) => (
      <div data-testid='dialog-content'>{children}</div>
    ),
    DialogFooter: ({ children }: { children: React.ReactNode }) => (
      <div data-testid='dialog-footer'>{children}</div>
    ),
    DialogHeader: ({ children }: { children: React.ReactNode }) => (
      <div data-testid='dialog-header'>{children}</div>
    ),
    DialogTitle: ({ children }: { children: React.ReactNode }) => (
      <div data-testid='dialog-title'>{children}</div>
    ),
    DialogClose: ({ children }: { children: React.ReactNode }) => (
      <div data-testid='dialog-close'>{children}</div>
    ),
    DialogPortal: ({ children }: { children: React.ReactNode }) => (
      <div data-testid='dialog-portal'>{children}</div>
    ),
  };
});

jest.mock('@/components/ui/select', () => {
  return {
    Select: ({ children }: { children: React.ReactNode }) => (
      <div data-testid='select'>{children}</div>
    ),
    SelectContent: ({ children }: { children: React.ReactNode }) => (
      <div data-testid='select-content'>{children}</div>
    ),
    SelectItem: ({
      children,
      value,
    }: {
      children: React.ReactNode;
      value: string;
    }) => <div data-testid={`select-item-${value}`}>{children}</div>,
    SelectTrigger: ({ children }: { children: React.ReactNode }) => (
      <div data-testid='select-trigger'>{children}</div>
    ),
    SelectValue: ({
      children,
      placeholder,
    }: {
      children?: React.ReactNode;
      placeholder?: string;
    }) => <div data-testid='select-value'>{children || placeholder}</div>,
  };
});

jest.mock('@/components/ui/checkbox', () => {
  return {
    Checkbox: ({
      checked,
      onCheckedChange,
      id,
    }: {
      checked?: boolean;
      onCheckedChange?: (checked: boolean) => void;
      id?: string;
    }) => (
      <input
        type='checkbox'
        id={id}
        checked={checked}
        onChange={(e) => onCheckedChange?.(e.target.checked)}
        data-testid='checkbox'
      />
    ),
  };
});

// Mock data
const mockChore: Chore = {
  id: '1',
  title: 'Clean kitchen',
  description: 'Clean kitchen counters and floor',
  assignedTo: '1',
  dueDate: new Date(Date.now() + 86400000).toISOString(),
  completed: false,
  recurring: true,
  recurrencePattern: 'weekly',
  priority: 'medium',
  category: 'Kitchen',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const mockHouseholdMembers = [
  {
    id: '1',
    name: 'Alex Johnson',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
  },
  {
    id: '2',
    name: 'Sam Smith',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sam',
  },
];

const mockCategories = [
  { id: '1', name: 'Kitchen' },
  { id: '2', name: 'Bathroom' },
  { id: '3', name: 'Living Room' },
];

// Mock the useChores hook
jest.mock('@/context/ChoresContext', () => ({
  useChores: () => ({
    addChore: jest.fn().mockResolvedValue({}),
    updateChore: jest.fn().mockResolvedValue({}),
    householdMembers: mockHouseholdMembers,
    categories: mockCategories,
  }),
}));

// Mock form submission
const mockHandleSubmit = jest.fn();
jest.mock('react-hook-form', () => ({
  ...jest.requireActual('react-hook-form'),
  useForm: () => ({
    register: jest.fn(),
    handleSubmit: () => mockHandleSubmit,
    setValue: jest.fn(),
    formState: { errors: {} },
  }),
}));

// Wrapper component to provide Dialog context
const DialogWrapper = ({ children }: { children: React.ReactNode }) => (
  <Dialog open={true}>{children}</Dialog>
);

describe('ChoreForm Component', () => {
  it('renders add chore form correctly', () => {
    render(
      <DialogWrapper>
        <ChoreForm householdId='1' />
      </DialogWrapper>
    );

    // Check if the title is correct for adding a new chore
    expect(screen.getByText('Add New Chore')).toBeInTheDocument();

    // Check field labels
    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Description')).toBeInTheDocument();
    expect(screen.getByText('Assigned To')).toBeInTheDocument();
    expect(screen.getByText('Due Date')).toBeInTheDocument();
    expect(screen.getByText('Recurring Chore')).toBeInTheDocument();
    expect(screen.getByText('Priority')).toBeInTheDocument();
    expect(screen.getByText('Category')).toBeInTheDocument();

    // Check buttons
    expect(screen.getByText('Cancel')).toBeInTheDocument();
    expect(screen.getByText('Add Chore')).toBeInTheDocument();
  });

  it('renders edit chore form correctly with initial data', () => {
    render(
      <DialogWrapper>
        <ChoreForm
          householdId='1'
          choreId={mockChore.id}
          initialData={mockChore}
        />
      </DialogWrapper>
    );

    // Check if the title is correct for editing
    expect(screen.getByText('Edit Chore')).toBeInTheDocument();

    // Check buttons
    expect(screen.getByText('Cancel')).toBeInTheDocument();
    expect(screen.getByText('Save Changes')).toBeInTheDocument();

    // Verify recurring checkbox is checked
    const recurringCheckbox = screen.getByLabelText('Recurring Chore');
    expect(recurringCheckbox).toBeInTheDocument();
    expect(recurringCheckbox).toHaveAttribute('checked', '');
  });

  it('shows recurrence pattern dropdown when recurring is checked', () => {
    render(
      <DialogWrapper>
        <ChoreForm householdId='1' />
      </DialogWrapper>
    );

    // Initially, recurrence pattern should not be visible
    expect(screen.queryByText('Recurrence Pattern')).not.toBeInTheDocument();

    // Check the recurring checkbox
    const recurringCheckbox = screen.getByLabelText('Recurring Chore');
    fireEvent.click(recurringCheckbox);

    // Now recurrence pattern should be visible
    expect(screen.getByText('Recurrence Pattern')).toBeInTheDocument();
  });

  it('shows error message when title is empty', async () => {
    // Mock form errors
    jest.mock('react-hook-form', () => ({
      ...jest.requireActual('react-hook-form'),
      useForm: () => ({
        register: jest.fn(),
        handleSubmit: jest.fn(),
        setValue: jest.fn(),
        formState: {
          errors: {
            title: { message: 'Title is required' },
          },
        },
      }),
    }));

    render(
      <DialogWrapper>
        <ChoreForm householdId='1' />
      </DialogWrapper>
    );

    // Submit the form
    const submitButton = screen.getByText('Add Chore');
    fireEvent.click(submitButton);

    // Check for error message
    await waitFor(() => {
      expect(screen.queryByText('Title is required')).toBeInTheDocument();
    });
  });
});
