import React from 'react';
import { render, screen } from '@testing-library/react';
import ChoreStats from '../chores/ChoreStats';
import { Chore } from '@/types/chores';

// Mock chore data
const mockChores: Chore[] = [
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
    assignedTo: '1',
    dueDate: new Date(Date.now() + 172800000).toISOString(),
    completed: true,
    recurring: false,
    priority: 'medium',
    category: 'Living Room',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'Clean bathroom',
    description: 'Clean toilet and shower',
    assignedTo: '2',
    dueDate: new Date(Date.now() + 86400000).toISOString(),
    completed: false,
    recurring: true,
    recurrencePattern: 'weekly',
    priority: 'high',
    category: 'Bathroom',
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
    householdMembers: mockHouseholdMembers,
    fetchChores: jest.fn(),
  }),
}));

describe('ChoreStats Component', () => {
  it('renders all stats cards correctly', () => {
    render(<ChoreStats householdId='1' />);

    // Check if summary cards are displayed
    expect(screen.getByText('Total Chores')).toBeInTheDocument();
    expect(screen.getByText('Completed')).toBeInTheDocument();
    expect(screen.getByText('Pending')).toBeInTheDocument();
    expect(screen.getByText('Completion Rate')).toBeInTheDocument();

    // Check if member performance section is displayed
    expect(screen.getByText('Member Performance')).toBeInTheDocument();

    // Check if categories section is displayed
    expect(screen.getByText('Categories')).toBeInTheDocument();
  });

  it('displays correct total numbers', () => {
    render(<ChoreStats householdId='1' />);

    // Total chores should be 3
    expect(screen.getByText('3')).toBeInTheDocument();

    // Completed chores should be 1
    expect(screen.getByText('1')).toBeInTheDocument();

    // Pending chores should be 2
    expect(screen.getByText('2')).toBeInTheDocument();

    // Completion rate should be 33.3%
    expect(screen.getByText('33.3%')).toBeInTheDocument();
  });

  it('displays member statistics correctly', () => {
    render(<ChoreStats householdId='1' />);

    // Check if both members are listed
    expect(screen.getByText('Alex Johnson')).toBeInTheDocument();
    expect(screen.getByText('Sam Smith')).toBeInTheDocument();

    // Alex has 2 chores (1 completed, 1 pending)
    expect(screen.getAllByText('Completed:').length).toBe(2);
    expect(screen.getAllByText('Pending:').length).toBe(2);
  });

  it('displays category statistics correctly', () => {
    render(<ChoreStats householdId='1' />);

    // Check if all categories are listed
    expect(screen.getByText('Kitchen')).toBeInTheDocument();
    expect(screen.getByText('Living Room')).toBeInTheDocument();
    expect(screen.getByText('Bathroom')).toBeInTheDocument();
  });

  it('displays high priority warning when applicable', () => {
    render(<ChoreStats householdId='1' />);

    // There are 2 high priority tasks that need attention
    expect(screen.getByText('High Priority Tasks')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(
      screen.getByText(/high priority tasks that need attention/)
    ).toBeInTheDocument();
  });
});
