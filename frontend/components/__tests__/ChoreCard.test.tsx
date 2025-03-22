import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ChoreCard from '../chores/ChoreCard';
import { Chore, HouseholdMember } from '@/types/chores';
import { choreService } from '@/lib/services/chore-service';
import { format } from 'date-fns';

// Mock the choreService
jest.mock('@/lib/services/chore-service', () => ({
  choreService: {
    updateChoreStatus: jest.fn().mockResolvedValue({}),
  },
}));

// Mock Dialog to avoid issues with portals in tests
jest.mock('@/components/ui/dialog', () => {
  return {
    Dialog: ({ children }: { children: React.ReactNode }) => (
      <div data-testid='dialog'>{children}</div>
    ),
    DialogTrigger: ({ children }: { children: React.ReactNode }) => (
      <div data-testid='dialog-trigger'>{children}</div>
    ),
  };
});

// Mock the ChoreForm component
jest.mock('../chores/ChoreForm', () => {
  return function MockChoreForm() {
    return <div data-testid='chore-form'>Mocked Chore Form</div>;
  };
});

// Mock the Select component
jest.mock('@/components/ui/select', () => {
  const OriginalModule = jest.requireActual('@/components/ui/select');
  return {
    ...OriginalModule,
    Select: ({
      children,
      value,
      onValueChange,
    }: {
      children: React.ReactNode;
      value: string;
      onValueChange: (value: string) => void;
    }) => (
      <div data-testid='select'>
        <div data-testid='select-value'>{value}</div>
        <button
          data-testid='select-pending'
          onClick={() => onValueChange('pending')}
        >
          Pending
        </button>
        <button
          data-testid='select-in-progress'
          onClick={() => onValueChange('in_progress')}
        >
          In Progress
        </button>
        <button
          data-testid='select-completed'
          onClick={() => onValueChange('completed')}
        >
          Completed
        </button>
        {children}
      </div>
    ),
    SelectContent: ({ children }: { children: React.ReactNode }) => (
      <div data-testid='select-content'>{children}</div>
    ),
    SelectItem: ({
      children,
    }: {
      children: React.ReactNode;
      value: string;
    }) => <div data-testid='select-item'>{children}</div>,
    SelectTrigger: ({ children }: { children: React.ReactNode }) => (
      <div data-testid='select-trigger'>{children}</div>
    ),
    SelectValue: ({ children }: { children: React.ReactNode }) => (
      <div data-testid='select-value-placeholder'>{children}</div>
    ),
  };
});

describe('ChoreCard', () => {
  const mockChore: Chore = {
    id: '1',
    title: 'Test Chore',
    description: 'This is a test chore',
    assignedTo: 'user1',
    dueDate: '2023-10-15',
    completed: false,
    recurring: false,
    priority: 'medium',
    category: 'Cleaning',
    createdAt: '2023-10-01',
    updatedAt: '2023-10-01',
  };

  const mockMember: HouseholdMember = {
    id: 'user1',
    name: 'John Doe',
    avatar: 'https://example.com/avatar.jpg',
  };

  const mockHandlers = {
    onMarkCompleted: jest.fn(),
    onDelete: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders chore details correctly', () => {
    render(
      <ChoreCard
        chore={mockChore}
        assignedMember={mockMember}
        onMarkCompleted={mockHandlers.onMarkCompleted}
        onDelete={mockHandlers.onDelete}
        householdId='household1'
      />
    );

    expect(screen.getByText('Test Chore')).toBeInTheDocument();
    expect(screen.getByText('This is a test chore')).toBeInTheDocument();
    expect(screen.getByText('medium priority')).toBeInTheDocument();
    expect(screen.getByText('Cleaning')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();

    // Format the date in the same way as the component
    if (mockChore.dueDate) {
      const formattedDate = format(new Date(mockChore.dueDate), 'MMM d, yyyy');
      expect(screen.getByText(formattedDate)).toBeInTheDocument();
    }
  });

  it('calls onMarkCompleted when checkbox is clicked', () => {
    render(
      <ChoreCard
        chore={mockChore}
        assignedMember={mockMember}
        onMarkCompleted={mockHandlers.onMarkCompleted}
        onDelete={mockHandlers.onDelete}
        householdId='household1'
      />
    );

    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);

    expect(mockHandlers.onMarkCompleted).toHaveBeenCalledWith('1', true);
  });

  it('applies line-through style when chore is completed', () => {
    const completedChore = { ...mockChore, completed: true };
    render(
      <ChoreCard
        chore={completedChore}
        assignedMember={mockMember}
        onMarkCompleted={mockHandlers.onMarkCompleted}
        onDelete={mockHandlers.onDelete}
        householdId='household1'
      />
    );

    const titleElement = screen.getByText('Test Chore');
    expect(titleElement).toHaveClass('line-through');
    expect(titleElement).toHaveClass('text-gray-400');
  });

  it('calls onDelete when delete button is clicked', () => {
    render(
      <ChoreCard
        chore={mockChore}
        assignedMember={mockMember}
        onMarkCompleted={mockHandlers.onMarkCompleted}
        onDelete={mockHandlers.onDelete}
        householdId='household1'
      />
    );

    const deleteButton = screen.getByLabelText('Delete chore');
    fireEvent.click(deleteButton);

    expect(mockHandlers.onDelete).toHaveBeenCalledWith('1');
  });

  it('renders correctly without an assigned member', () => {
    render(
      <ChoreCard
        chore={mockChore}
        assignedMember={null}
        onMarkCompleted={mockHandlers.onMarkCompleted}
        onDelete={mockHandlers.onDelete}
        householdId='household1'
      />
    );

    expect(screen.getByText('Test Chore')).toBeInTheDocument();
    expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
  });

  it('renders correctly without a due date', () => {
    const choreWithoutDueDate = { ...mockChore, dueDate: null };
    render(
      <ChoreCard
        chore={choreWithoutDueDate}
        assignedMember={mockMember}
        onMarkCompleted={mockHandlers.onMarkCompleted}
        onDelete={mockHandlers.onDelete}
        householdId='household1'
      />
    );

    expect(screen.getByText('Test Chore')).toBeInTheDocument();
    expect(screen.queryByText(/Oct 15, 2023/)).not.toBeInTheDocument();
  });

  it('initializes status to "pending" for non-completed chores', () => {
    render(
      <ChoreCard
        chore={mockChore}
        assignedMember={mockMember}
        onMarkCompleted={mockHandlers.onMarkCompleted}
        onDelete={mockHandlers.onDelete}
        householdId='household1'
      />
    );

    // Get the first select-value element
    const statusValues = screen.getAllByTestId('select-value');
    expect(statusValues[0]).toHaveTextContent('pending');
  });

  it('initializes status to "completed" for completed chores', () => {
    const completedChore = { ...mockChore, completed: true };
    render(
      <ChoreCard
        chore={completedChore}
        assignedMember={mockMember}
        onMarkCompleted={mockHandlers.onMarkCompleted}
        onDelete={mockHandlers.onDelete}
        householdId='household1'
      />
    );

    // Get the first select-value element
    const statusValues = screen.getAllByTestId('select-value');
    expect(statusValues[0]).toHaveTextContent('completed');
  });

  it('updates status and calls appropriate services when status changes to in_progress', async () => {
    render(
      <ChoreCard
        chore={mockChore}
        assignedMember={mockMember}
        onMarkCompleted={mockHandlers.onMarkCompleted}
        onDelete={mockHandlers.onDelete}
        householdId='household1'
      />
    );

    const inProgressButton = screen.getByTestId('select-in-progress');
    fireEvent.click(inProgressButton);

    await waitFor(() => {
      expect(choreService.updateChoreStatus).toHaveBeenCalledWith(
        '1',
        'in_progress'
      );
      expect(mockHandlers.onMarkCompleted).not.toHaveBeenCalled(); // Shouldn't mark as completed
    });
  });

  it('updates status and calls appropriate services when status changes to completed', async () => {
    render(
      <ChoreCard
        chore={mockChore}
        assignedMember={mockMember}
        onMarkCompleted={mockHandlers.onMarkCompleted}
        onDelete={mockHandlers.onDelete}
        householdId='household1'
      />
    );

    const completedButton = screen.getByTestId('select-completed');
    fireEvent.click(completedButton);

    await waitFor(() => {
      expect(choreService.updateChoreStatus).toHaveBeenCalledWith(
        '1',
        'completed'
      );
      expect(mockHandlers.onMarkCompleted).toHaveBeenCalledWith('1', true);
    });
  });
});
