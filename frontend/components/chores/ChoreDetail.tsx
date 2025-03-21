import React from 'react';
import { Chore, User } from '../../lib/types';
import { Card, CardContent, CardHeader } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Table, TableBody, TableCell, TableRow } from '../ui/table';
import { cn } from '../../lib/utils';

interface ChoreDetailProps {
  chore: Chore;
  users: User[];
  onBack: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const priorityVariants = {
  low: 'bg-green-100 text-green-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-red-100 text-red-800',
};

const statusVariants = {
  pending: 'bg-gray-100 text-gray-800',
  in_progress: 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800',
};

export default function ChoreDetail({
  chore,
  users,
  onBack,
  onEdit,
  onDelete,
}: ChoreDetailProps) {
  const formattedDueDate = chore.due_date
    ? new Date(chore.due_date).toLocaleDateString()
    : 'No due date';

  const formattedCreatedAt = new Date(chore.created_at).toLocaleDateString();
  const formattedUpdatedAt = new Date(chore.updated_at).toLocaleDateString();
  const formattedCompletedAt = chore.completed_at
    ? new Date(chore.completed_at).toLocaleDateString()
    : '-';

  const assignedUser = chore.assigned_to
    ? users.find((user) => user.id === chore.assigned_to)
    : null;

  const createdByUser = chore.created_by
    ? users.find((user) => user.id === chore.created_by)
    : null;

  const isOverdue =
    chore.due_date &&
    new Date(chore.due_date) < new Date() &&
    chore.status !== 'completed';

  return (
    <Card className='max-w-3xl mx-auto rounded-lg shadow'>
      <CardHeader className='pb-0'>
        <div className='flex justify-between items-start'>
          <Button
            onClick={onBack}
            variant='ghost'
            className='p-0 flex items-center text-blue-600 hover:text-blue-800'
          >
            <span>← Back to List</span>
          </Button>
          <div className='flex space-x-2'>
            <Button onClick={onEdit} variant='default' size='sm'>
              Edit
            </Button>
            <Button onClick={onDelete} variant='destructive' size='sm'>
              Delete
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className='p-6'>
        <div className='mb-6'>
          <h1 className='text-2xl font-bold mb-2'>{chore.title}</h1>
          <div className='flex space-x-3 mb-4'>
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
            {chore.recurring !== 'none' && (
              <Badge
                variant='outline'
                className='bg-purple-100 text-purple-800'
              >
                {chore.recurring.charAt(0).toUpperCase() +
                  chore.recurring.slice(1)}
              </Badge>
            )}
          </div>

          {chore.description && (
            <div className='bg-gray-50 p-4 rounded-md mb-4'>
              <p className='text-gray-700'>{chore.description}</p>
            </div>
          )}
        </div>

        <div className='grid grid-cols-2 gap-6 mb-6'>
          <div>
            <h3 className='font-semibold mb-2'>Assignment</h3>
            <p className='text-gray-700'>
              {assignedUser ? assignedUser.name : 'Unassigned'}
            </p>
          </div>
          <div>
            <h3 className='font-semibold mb-2'>Due Date</h3>
            <p
              className={cn(
                isOverdue ? 'text-red-600 font-semibold' : 'text-gray-700'
              )}
            >
              {formattedDueDate}
            </p>
          </div>
        </div>

        <div className='border-t pt-4'>
          <h3 className='font-semibold mb-2'>Chore Details</h3>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell className='py-2 text-gray-500'>Created By</TableCell>
                <TableCell>
                  {createdByUser ? createdByUser.name : 'Unknown'}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className='py-2 text-gray-500'>Created On</TableCell>
                <TableCell>{formattedCreatedAt}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className='py-2 text-gray-500'>
                  Last Updated
                </TableCell>
                <TableCell>{formattedUpdatedAt}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className='py-2 text-gray-500'>
                  Completed On
                </TableCell>
                <TableCell>{formattedCompletedAt}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
