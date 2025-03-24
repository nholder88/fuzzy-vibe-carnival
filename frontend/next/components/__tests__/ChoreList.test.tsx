import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ChoreList from '../chores/ChoreList';
import { format } from 'date-fns';

// Mock chore data
const mockChores = [
  {
    id: '1',
    title: 'Clean kitchen',
    description: 'Clean kitchen counters and floor',
    assignedTo: '1',
    dueDate: new Date(Date.now() + 86400000).toISOString(),
    completed: false,
    recurring: true,
    recurrencePattern: 'daily',
    priority: 'high',
    category: 'Kitchen',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Vacuum living room',
    description: 'Vacuum the carpet in the living room',
    assignedTo: '2',
    dueDate: new Date(Date.now() + 172800000).toISOString(),
    completed: true,
    recurring: false,
    priority: 'medium',
    category: 'Living Room',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

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

// Mock the useChores hook
jest.mock('@/context/ChoresContext', () => ({
  useChores: () => ({
    chores: mockChores,
    isLoading: false,
    error: null,
    fetchChores: jest.fn(),
    markChoreAsCompleted: jest.fn(),
    deleteChore: jest.fn(),
    householdMembers: mockHouseholdMembers,
    filters: {},
  }),
}));

// Mock the dialog component
jest.mock('@/components/ui/dialog', () => ({
  Dialog: ({ children }: { children: React.ReactNode }) => (
    <div data-testid='dialog'>{children}</div>
  ),
  DialogTrigger: ({ children }: { children: React.ReactNode }) => (
    <div data-testid='dialog-trigger'>{children}</div>
  ),
}));

// Mock the ChoreForm component
jest.mock('../chores/ChoreForm', () => ({
  __esModule: true,
  default: () => <div data-testid='chore-form'>Chore Form</div>,
}));

describe('ChoreList Component', () => {
  it('renders chores correctly', () => {
    render(<ChoreList householdId='1' filterCompleted={null} />);

    // Check if both chore titles are displayed
    expect(screen.getByText('Clean kitchen')).toBeInTheDocument();
    expect(screen.getByText('Vacuum living room')).toBeInTheDocument();

    // Check descriptions
    expect(
      screen.getByText('Clean kitchen counters and floor')
    ).toBeInTheDocument();
    expect(
      screen.getByText('Vacuum the carpet in the living room')
    ).toBeInTheDocument();

    // Check priorities
    expect(screen.getByText('high')).toBeInTheDocument();
    expect(screen.getByText('medium')).toBeInTheDocument();

    // Check categories
    expect(screen.getByText('Kitchen')).toBeInTheDocument();
    expect(screen.getByText('Living Room')).toBeInTheDocument();
  });

  it('displays assigned members correctly', () => {
    render(<ChoreList householdId='1' filterCompleted={null} />);

    // Check assigned members
    expect(screen.getByText('Alex Johnson')).toBeInTheDocument();
    expect(screen.getByText('Sam Smith')).toBeInTheDocument();
  });

  it('marks a completed chore with line-through style', () => {
    render(<ChoreList householdId='1' filterCompleted={null} />);

    // The completed chore should have the line-through style
    const vacuumTitle = screen.getByText('Vacuum living room');
    expect(vacuumTitle.className).toContain('line-through');

    // The incomplete chore should not have the line-through style
    const cleanKitchenTitle = screen.getByText('Clean kitchen');
    expect(cleanKitchenTitle.className).not.toContain('line-through');
  });

  it('displays due dates correctly', () => {
    render(<ChoreList householdId='1' filterCompleted={null} />);

    // Format the due dates as expected in the component
    const dueDate1 = format(new Date(mockChores[0].dueDate), 'MMM d, yyyy');
    const dueDate2 = format(new Date(mockChores[1].dueDate), 'MMM d, yyyy');

    expect(screen.getByText(dueDate1)).toBeInTheDocument();
    expect(screen.getByText(dueDate2)).toBeInTheDocument();
  });

  it('shows edit and delete buttons for each chore', () => {
    render(<ChoreList householdId='1' filterCompleted={null} />);

    // There should be two dialog triggers (edit buttons)
    const dialogTriggers = screen.getAllByTestId('dialog-trigger');
    expect(dialogTriggers.length).toBe(2);

    // Test for edit and delete buttons
    // Since we're using icons, we'll check for the parent buttons
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBe(4); // 2 edit buttons and 2 delete buttons
  });
});
