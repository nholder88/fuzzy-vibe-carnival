import React from 'react';
import { Chore, User } from '../../lib/types';

interface ChoreDetailProps {
  chore: Chore;
  users: User[];
  onBack: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const priorityColors = {
  low: 'bg-green-100 text-green-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-red-100 text-red-800',
};

const statusColors = {
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
    <div className='max-w-3xl mx-auto bg-white rounded-lg shadow p-6'>
      <div className='flex justify-between items-start mb-6'>
        <button
          onClick={onBack}
          className='flex items-center text-blue-600 hover:text-blue-800'
        >
          <span>← Back to List</span>
        </button>
        <div className='flex space-x-2'>
          <button
            onClick={onEdit}
            className='px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700'
          >
            Edit
          </button>
          <button
            onClick={onDelete}
            className='px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700'
          >
            Delete
          </button>
        </div>
      </div>

      <div className='mb-6'>
        <h1 className='text-2xl font-bold mb-2'>{chore.title}</h1>
        <div className='flex space-x-3 mb-4'>
          <span
            className={`text-xs px-2 py-1 rounded-full ${
              priorityColors[chore.priority]
            }`}
          >
            {chore.priority.charAt(0).toUpperCase() + chore.priority.slice(1)}{' '}
            Priority
          </span>
          <span
            className={`text-xs px-2 py-1 rounded-full ${
              statusColors[chore.status]
            }`}
          >
            {chore.status
              .split('_')
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(' ')}
          </span>
          {chore.recurring !== 'none' && (
            <span className='text-xs px-2 py-1 rounded-full bg-purple-100 text-purple-800'>
              {chore.recurring.charAt(0).toUpperCase() +
                chore.recurring.slice(1)}
            </span>
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
            className={`${
              isOverdue ? 'text-red-600 font-semibold' : 'text-gray-700'
            }`}
          >
            {formattedDueDate}
          </p>
        </div>
      </div>

      <div className='border-t pt-4'>
        <h3 className='font-semibold mb-2'>Chore Details</h3>
        <table className='w-full text-sm'>
          <tbody>
            <tr>
              <td className='py-2 text-gray-500'>Created By</td>
              <td className='py-2'>
                {createdByUser ? createdByUser.name : 'Unknown'}
              </td>
            </tr>
            <tr>
              <td className='py-2 text-gray-500'>Created On</td>
              <td className='py-2'>{formattedCreatedAt}</td>
            </tr>
            <tr>
              <td className='py-2 text-gray-500'>Last Updated</td>
              <td className='py-2'>{formattedUpdatedAt}</td>
            </tr>
            <tr>
              <td className='py-2 text-gray-500'>Completed On</td>
              <td className='py-2'>{formattedCompletedAt}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
