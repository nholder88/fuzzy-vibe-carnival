import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ChoreCard from '../chores/ChoreCard';
import { Chore, HouseholdMember } from '@/types/chores';

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
    expect(screen.getByText('Oct 15, 2023')).toBeInTheDocument();
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
});
