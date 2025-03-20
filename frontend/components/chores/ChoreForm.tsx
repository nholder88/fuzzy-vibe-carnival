import React, { useState, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Chore, User } from '../../lib/types';
import { createChore, updateChore } from '../../lib/api/chores';

interface ChoreFormProps {
  householdId: string;
  chore?: Chore;
  users: User[];
  onSuccess: () => void;
  onCancel: () => void;
}

type ChoreFormValues = {
  title: string;
  description: string;
  assigned_to: string;
  status: 'pending' | 'in_progress' | 'completed';
  due_date: string;
  priority: 'low' | 'medium' | 'high';
  recurring: 'none' | 'daily' | 'weekly' | 'monthly';
};

export default function ChoreForm({
  householdId,
  chore,
  users,
  onSuccess,
  onCancel,
}: ChoreFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChoreFormValues>({
    defaultValues: chore
      ? {
          title: chore.title,
          description: chore.description || '',
          assigned_to: chore.assigned_to || '',
          status: chore.status,
          due_date: chore.due_date
            ? new Date(chore.due_date).toISOString().split('T')[0]
            : '',
          priority: chore.priority,
          recurring: chore.recurring,
        }
      : {
          title: '',
          description: '',
          assigned_to: '',
          status: 'pending',
          due_date: '',
          priority: 'medium',
          recurring: 'none',
        },
  });

  useEffect(() => {
    if (chore) {
      reset({
        title: chore.title,
        description: chore.description || '',
        assigned_to: chore.assigned_to || '',
        status: chore.status,
        due_date: chore.due_date
          ? new Date(chore.due_date).toISOString().split('T')[0]
          : '',
        priority: chore.priority,
        recurring: chore.recurring,
      });
    }
  }, [chore, reset]);

  const onSubmit: SubmitHandler<ChoreFormValues> = async (data) => {
    try {
      setIsSubmitting(true);
      setError(null);

      if (chore) {
        await updateChore(chore.id, {
          ...data,
          household_id: householdId,
        });
      } else {
        await createChore({
          ...data,
          household_id: householdId,
        });
      }

      onSuccess();
    } catch (err) {
      setError('Failed to save chore. Please try again.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className='space-y-4 p-4 bg-white rounded-lg shadow'
    >
      <h2 className='text-xl font-semibold'>
        {chore ? 'Edit Chore' : 'Add New Chore'}
      </h2>

      {error && <div className='text-red-500 text-sm'>{error}</div>}

      <div>
        <label
          htmlFor='title'
          className='block text-sm font-medium text-gray-700 mb-1'
        >
          Title <span className='text-red-500'>*</span>
        </label>
        <input
          id='title'
          type='text'
          className='w-full px-3 py-2 border rounded-md'
          {...register('title', { required: 'Title is required' })}
        />
        {errors.title && (
          <p className='text-red-500 text-xs mt-1'>{errors.title.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor='description'
          className='block text-sm font-medium text-gray-700 mb-1'
        >
          Description
        </label>
        <textarea
          id='description'
          rows={3}
          className='w-full px-3 py-2 border rounded-md'
          {...register('description')}
        />
      </div>

      <div className='grid grid-cols-2 gap-4'>
        <div>
          <label
            htmlFor='priority'
            className='block text-sm font-medium text-gray-700 mb-1'
          >
            Priority <span className='text-red-500'>*</span>
          </label>
          <select
            id='priority'
            className='w-full px-3 py-2 border rounded-md'
            {...register('priority', { required: 'Priority is required' })}
          >
            <option value='low'>Low</option>
            <option value='medium'>Medium</option>
            <option value='high'>High</option>
          </select>
        </div>

        <div>
          <label
            htmlFor='status'
            className='block text-sm font-medium text-gray-700 mb-1'
          >
            Status <span className='text-red-500'>*</span>
          </label>
          <select
            id='status'
            className='w-full px-3 py-2 border rounded-md'
            {...register('status', { required: 'Status is required' })}
          >
            <option value='pending'>Pending</option>
            <option value='in_progress'>In Progress</option>
            <option value='completed'>Completed</option>
          </select>
        </div>
      </div>

      <div className='grid grid-cols-2 gap-4'>
        <div>
          <label
            htmlFor='due_date'
            className='block text-sm font-medium text-gray-700 mb-1'
          >
            Due Date
          </label>
          <input
            id='due_date'
            type='date'
            className='w-full px-3 py-2 border rounded-md'
            {...register('due_date')}
          />
        </div>

        <div>
          <label
            htmlFor='recurring'
            className='block text-sm font-medium text-gray-700 mb-1'
          >
            Recurring
          </label>
          <select
            id='recurring'
            className='w-full px-3 py-2 border rounded-md'
            {...register('recurring')}
          >
            <option value='none'>None</option>
            <option value='daily'>Daily</option>
            <option value='weekly'>Weekly</option>
            <option value='monthly'>Monthly</option>
          </select>
        </div>
      </div>

      <div>
        <label
          htmlFor='assigned_to'
          className='block text-sm font-medium text-gray-700 mb-1'
        >
          Assign To
        </label>
        <select
          id='assigned_to'
          className='w-full px-3 py-2 border rounded-md'
          {...register('assigned_to')}
        >
          <option value=''>Unassigned</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </select>
      </div>

      <div className='flex justify-end space-x-3 pt-4'>
        <button
          type='button'
          onClick={onCancel}
          className='px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50'
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          type='submit'
          className='px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : chore ? 'Update Chore' : 'Create Chore'}
        </button>
      </div>
    </form>
  );
}
