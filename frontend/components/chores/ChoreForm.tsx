import React, { useState, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Chore, User } from '../../lib/types';
import { createChore, updateChore } from '../../lib/api/chores';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Card, CardContent } from '../ui/card';

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

  // Custom state for select fields since they're managed differently with shadcn
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>(
    chore?.priority || 'medium'
  );
  const [status, setStatus] = useState<'pending' | 'in_progress' | 'completed'>(
    chore?.status || 'pending'
  );
  const [recurring, setRecurring] = useState<
    'none' | 'daily' | 'weekly' | 'monthly'
  >(chore?.recurring || 'none');
  const [assignedTo, setAssignedTo] = useState<string>(
    chore?.assigned_to || 'unassigned'
  );

  const {
    register,
    handleSubmit,
    reset,
    setValue,
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

      setPriority(chore.priority);
      setStatus(chore.status);
      setRecurring(chore.recurring);
      setAssignedTo(chore.assigned_to || 'unassigned');
    }
  }, [chore, reset]);

  // Update form values when selects change
  useEffect(() => {
    setValue('priority', priority);
    setValue('status', status);
    setValue('recurring', recurring);
    setValue('assigned_to', assignedTo === 'unassigned' ? '' : assignedTo);
  }, [priority, status, recurring, assignedTo, setValue]);

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
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
      <h2 className='text-xl font-semibold'>
        {chore ? 'Edit Chore' : 'Add New Chore'}
      </h2>

      {error && <div className='text-red-500 text-sm'>{error}</div>}

      <div className='space-y-2'>
        <label htmlFor='title' className='block text-sm font-medium'>
          Title <span className='text-red-500'>*</span>
        </label>
        <Input
          id='title'
          type='text'
          {...register('title', { required: 'Title is required' })}
        />
        {errors.title && (
          <p className='text-red-500 text-xs'>{errors.title.message}</p>
        )}
      </div>

      <div className='space-y-2'>
        <label htmlFor='description' className='block text-sm font-medium'>
          Description
        </label>
        <Textarea id='description' rows={3} {...register('description')} />
      </div>

      <div className='grid grid-cols-2 gap-4'>
        <div className='space-y-2'>
          <label htmlFor='priority' className='block text-sm font-medium'>
            Priority <span className='text-red-500'>*</span>
          </label>
          <Select
            value={priority}
            onValueChange={(value) =>
              setPriority(value as 'low' | 'medium' | 'high')
            }
          >
            <SelectTrigger>
              <SelectValue placeholder='Select priority' />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value='low'>Low</SelectItem>
                <SelectItem value='medium'>Medium</SelectItem>
                <SelectItem value='high'>High</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className='space-y-2'>
          <label htmlFor='status' className='block text-sm font-medium'>
            Status <span className='text-red-500'>*</span>
          </label>
          <Select
            value={status}
            onValueChange={(value) =>
              setStatus(value as 'pending' | 'in_progress' | 'completed')
            }
          >
            <SelectTrigger>
              <SelectValue placeholder='Select status' />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value='pending'>Pending</SelectItem>
                <SelectItem value='in_progress'>In Progress</SelectItem>
                <SelectItem value='completed'>Completed</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className='grid grid-cols-2 gap-4'>
        <div className='space-y-2'>
          <label htmlFor='due_date' className='block text-sm font-medium'>
            Due Date
          </label>
          <Input id='due_date' type='date' {...register('due_date')} />
        </div>

        <div className='space-y-2'>
          <label htmlFor='recurring' className='block text-sm font-medium'>
            Recurring
          </label>
          <Select
            value={recurring}
            onValueChange={(value) =>
              setRecurring(value as 'none' | 'daily' | 'weekly' | 'monthly')
            }
          >
            <SelectTrigger>
              <SelectValue placeholder='Select recurrence' />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value='none'>None</SelectItem>
                <SelectItem value='daily'>Daily</SelectItem>
                <SelectItem value='weekly'>Weekly</SelectItem>
                <SelectItem value='monthly'>Monthly</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className='space-y-2'>
        <label htmlFor='assigned_to' className='block text-sm font-medium'>
          Assign To
        </label>
        <Select value={assignedTo} onValueChange={setAssignedTo}>
          <SelectTrigger>
            <SelectValue placeholder='Select user' />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value='unassigned'>Unassigned</SelectItem>
              {users.map((user) => (
                <SelectItem key={user.id} value={user.id}>
                  {user.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div className='flex justify-end space-x-3 pt-4'>
        <Button
          type='button'
          onClick={onCancel}
          variant='outline'
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type='submit' disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save Chore'}
        </Button>
      </div>
    </form>
  );
}
