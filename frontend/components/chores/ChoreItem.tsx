import React from 'react';
import { Chore } from '../../lib/types';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';

const priorityVariants = {
  low: 'bg-green-100 text-green-800 hover:bg-green-100',
  medium: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100',
  high: 'bg-red-100 text-red-800 hover:bg-red-100',
};

const statusVariants = {
  pending: 'bg-gray-100 text-gray-800 hover:bg-gray-100',
  in_progress: 'bg-blue-100 text-blue-800 hover:bg-blue-100',
  completed: 'bg-green-100 text-green-800 hover:bg-green-100',
};

interface ChoreItemProps {
  chore: Chore;
  onClick?: () => void;
}

export default function ChoreItem({ chore, onClick }: ChoreItemProps) {
  const formattedDueDate = chore.due_date
    ? new Date(chore.due_date).toLocaleDateString()
    : 'No due date';

  const isOverdue =
    chore.due_date &&
    new Date(chore.due_date) < new Date() &&
    chore.status !== 'completed';

  return (
    <Card
      className={`cursor-pointer hover:shadow-md transition-shadow ${
        isOverdue ? 'border-red-300' : 'border-gray-200'
      }`}
      onClick={onClick}
    >
      <CardContent className='p-4'>
        <div className='flex justify-between items-start'>
          <div>
            <h3 className='font-semibold text-lg'>{chore.title}</h3>
            {chore.description && (
              <p className='text-gray-600 mt-1'>{chore.description}</p>
            )}
          </div>
          <div className='flex flex-col items-end space-y-2'>
            <Badge
              variant='outline'
              className={priorityVariants[chore.priority]}
            >
              {chore.priority.charAt(0).toUpperCase() + chore.priority.slice(1)}{' '}
              Priority
            </Badge>
            <Badge variant='outline' className={statusVariants[chore.status]}>
              {chore.status
                .split('_')
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ')}
            </Badge>
          </div>
        </div>

        <div className='mt-4 flex justify-between items-center text-sm'>
          <div>
            <span
              className={`${
                isOverdue ? 'text-red-600 font-semibold' : 'text-gray-500'
              }`}
            >
              Due: {formattedDueDate}
            </span>
          </div>
          {chore.recurring !== 'none' && (
            <Badge
              variant='outline'
              className='bg-purple-100 text-purple-600 hover:bg-purple-100'
            >
              {chore.recurring.charAt(0).toUpperCase() +
                chore.recurring.slice(1)}
            </Badge>
          )}
        </div>

        {chore.assigned_to && (
          <div className='mt-2 text-sm text-gray-500'>
            Assigned to: {chore.assigned_to}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
