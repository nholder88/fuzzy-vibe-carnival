import React, { useEffect } from 'react';
import { useChores } from '@/context/ChoresContext';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import ChoreCard from './ChoreCard';

interface ChoreListProps {
  householdId: string;
  filterCompleted: boolean | null;
}

export default function ChoreList({
  householdId,
  filterCompleted,
}: ChoreListProps) {
  const {
    chores,
    isLoading,
    error,
    fetchChores,
    markChoreAsCompleted,
    deleteChore,
    householdMembers,
    filters,
  } = useChores();

  useEffect(() => {
    // Apply the completed filter if specified
    const updatedFilters = { ...filters };
    if (filterCompleted !== null) {
      updatedFilters.completed = filterCompleted;
    }

    fetchChores(householdId);
  }, [householdId, fetchChores, filterCompleted, filters]);

  if (isLoading && chores.length === 0) {
    return (
      <div className='space-y-4'>
        {[...Array(3)].map((_, i) => (
          <Card key={i} className='overflow-hidden'>
            <CardContent className='p-6'>
              <div className='flex items-center gap-4'>
                <Skeleton className='h-5 w-5 rounded-full' />
                <div className='space-y-2 flex-1'>
                  <Skeleton className='h-4 w-1/3' />
                  <Skeleton className='h-3 w-2/3' />
                </div>
                <Skeleton className='h-9 w-20' />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return <div className='text-red-500 p-4 rounded bg-red-50'>{error}</div>;
  }

  if (chores.length === 0) {
    return (
      <div className='text-center p-8'>
        <h3 className='text-lg font-medium'>No chores found</h3>
        <p className='text-gray-500 mt-2'>
          No chores match your current filters.
        </p>
      </div>
    );
  }

  const getAssignedMember = (assignedToId: string | null) => {
    if (!assignedToId) return null;
    const member = householdMembers.find(
      (member) => member.id === assignedToId
    );
    return member || null;
  };

  return (
    <div className='space-y-4' data-testid='chore-list'>
      {chores.map((chore) => {
        const assignedMember = getAssignedMember(chore.assignedTo);

        return (
          <ChoreCard
            key={chore.id}
            chore={chore}
            assignedMember={assignedMember}
            onMarkCompleted={markChoreAsCompleted}
            onDelete={deleteChore}
            householdId={householdId}
          />
        );
      })}
    </div>
  );
}
