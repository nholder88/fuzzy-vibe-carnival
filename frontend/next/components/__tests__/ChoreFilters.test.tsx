import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ChoreFilters from '../chores/ChoreFilters';
import { ChoresProvider } from '@/context/ChoresContext';

// Mock the useChores hook
jest.mock('@/context/ChoresContext', () => ({
  useChores: () => ({
    filters: { assignedTo: null, priority: null, category: null },
    setFilters: jest.fn(),
    householdMembers: [
      { id: '1', name: 'Alex Johnson' },
      { id: '2', name: 'Sam Smith' },
    ],
    categories: [
      { id: '1', name: 'Kitchen' },
      { id: '2', name: 'Bathroom' },
    ],
  }),
  ChoresProvider: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

describe('ChoreFilters Component', () => {
  it('renders filter options correctly', () => {
    render(<ChoreFilters />);

    // Check if the component title is rendered
    expect(screen.getByText('Filter Chores')).toBeInTheDocument();

    // Check for filter labels
    expect(screen.getByText('Assigned To')).toBeInTheDocument();
    expect(screen.getByText('Priority')).toBeInTheDocument();
    expect(screen.getByText('Category')).toBeInTheDocument();

    // Check for "All" options
    expect(screen.getAllByText('All Members')).toHaveLength(1);
    expect(screen.getAllByText('All Priorities')).toHaveLength(1);
    expect(screen.getAllByText('All Categories')).toHaveLength(1);
  });

  it('displays correct assigned members', async () => {
    render(<ChoreFilters />);

    // Open the assigned to dropdown
    const assignedDropdown = screen.getByText('All Members');
    fireEvent.click(assignedDropdown);

    // Check if members are displayed
    expect(screen.getByText('Alex Johnson')).toBeInTheDocument();
    expect(screen.getByText('Sam Smith')).toBeInTheDocument();
  });

  it('displays correct categories', async () => {
    render(<ChoreFilters />);

    // Open the category dropdown
    const categoryDropdown = screen.getByText('All Categories');
    fireEvent.click(categoryDropdown);

    // Check if categories are displayed
    expect(screen.getByText('Kitchen')).toBeInTheDocument();
    expect(screen.getByText('Bathroom')).toBeInTheDocument();
  });

  it('displays correct priority options', async () => {
    render(<ChoreFilters />);

    // Open the priority dropdown
    const priorityDropdown = screen.getByText('All Priorities');
    fireEvent.click(priorityDropdown);

    // Check if priority options are displayed
    expect(screen.getByText('High')).toBeInTheDocument();
    expect(screen.getByText('Medium')).toBeInTheDocument();
    expect(screen.getByText('Low')).toBeInTheDocument();
  });
});
