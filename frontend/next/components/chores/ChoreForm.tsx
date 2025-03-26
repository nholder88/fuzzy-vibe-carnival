import React, { useEffect, useState } from 'react';
import { useChores } from '@/context/ChoresContext';
import { Chore, ChoreFormData } from '@/types/chores';
import { useForm } from 'react-hook-form';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { format } from 'date-fns';

interface ChoreFormProps {
  householdId: string;
  onClose?: () => void;
  choreId?: string;
  initialData?: Chore;
}

export default function ChoreForm({
  householdId,
  onClose,
  choreId,
  initialData,
}: ChoreFormProps) {
  const { addChore, updateChore, householdMembers, categories } = useChores();

  const isEditMode = !!choreId;
  const [isRecurring, setIsRecurring] = useState(
    initialData?.recurring || false
  );

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ChoreFormData>({
    defaultValues: initialData
      ? {
          title: initialData.title,
          description: initialData.description,
          assignedTo: initialData.assignedTo,
          dueDate: initialData.dueDate
            ? format(new Date(initialData.dueDate), 'yyyy-MM-dd')
            : null,
          recurring: initialData.recurring,
          recurrencePattern: initialData.recurrencePattern,
          priority: initialData.priority,
          category: initialData.category,
        }
      : {
          title: '',
          description: '',
          assignedTo: null,
          dueDate: null,
          recurring: false,
          recurrencePattern: 'daily',
          priority: 'medium',
          category: 'General',
        },
  });

  useEffect(() => {
    register('title', { required: 'Title is required' });
    register('description');
    register('assignedTo');
    register('dueDate');
    register('recurring');
    register('recurrencePattern');
    register('priority');
    register('category');
  }, [register]);

  const onSubmit = async (data: ChoreFormData) => {
    try {
      if (isEditMode && choreId) {
        await updateChore(choreId, data);
      } else {
        await addChore(householdId, data);
      }
      onClose?.();
    } catch (error) {
      console.error('Error saving chore:', error);
    }
  };

  const handleRecurringChange = (checked: boolean) => {
    setIsRecurring(checked);
    setValue('recurring', checked);
  };

  return (
    <DialogContent className='sm:max-w-[600px]'>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? 'Edit Chore' : 'Add New Chore'}
          </DialogTitle>
        </DialogHeader>

        <div className='grid gap-4 py-4'>
          <div className='grid gap-2'>
            <Label htmlFor='title'>Title</Label>
            <Input
              id='title'
              placeholder='Enter chore title'
              defaultValue={initialData?.title}
              onChange={(e) => setValue('title', e.target.value)}
              className={errors.title ? 'border-red-500' : ''}
            />
            {errors.title && (
              <p className='text-red-500 text-sm'>{errors.title.message}</p>
            )}
          </div>

          <div className='grid gap-2'>
            <Label htmlFor='description'>Description</Label>
            <Textarea
              id='description'
              placeholder='Enter chore description'
              defaultValue={initialData?.description}
              onChange={(e) => setValue('description', e.target.value)}
              rows={3}
            />
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div className='grid gap-2'>
              <Label htmlFor='assignedTo'>Assigned To</Label>
              <Select
                defaultValue={initialData?.assignedTo || undefined}
                onValueChange={(value) => setValue('assignedTo', value)}
              >
                <SelectTrigger id='assignedTo'>
                  <SelectValue placeholder='Select a person' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='unassigned'>Not Assigned</SelectItem>
                  {householdMembers.map((member) => (
                    <SelectItem key={member.id} value={member.id}>
                      {member.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className='grid gap-2'>
              <Label htmlFor='dueDate'>Due Date</Label>
              <Input
                id='dueDate'
                type='date'
                defaultValue={
                  initialData?.dueDate
                    ? format(new Date(initialData.dueDate), 'yyyy-MM-dd')
                    : ''
                }
                onChange={(e) => setValue('dueDate', e.target.value || null)}
              />
            </div>
          </div>

          <div className='grid gap-2'>
            <div className='flex items-center space-x-2'>
              <Checkbox
                id='recurring'
                checked={isRecurring}
                onCheckedChange={handleRecurringChange}
              />
              <Label htmlFor='recurring'>Recurring Chore</Label>
            </div>
          </div>

          {isRecurring && (
            <div className='grid gap-2'>
              <Label htmlFor='recurrencePattern'>Recurrence Pattern</Label>
              <Select
                defaultValue={initialData?.recurrencePattern || 'daily'}
                onValueChange={(value) => setValue('recurrencePattern', value)}
              >
                <SelectTrigger id='recurrencePattern'>
                  <SelectValue placeholder='Select a pattern' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='daily'>Daily</SelectItem>
                  <SelectItem value='weekly'>Weekly</SelectItem>
                  <SelectItem value='biweekly'>Bi-weekly</SelectItem>
                  <SelectItem value='monthly'>Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div className='grid gap-2'>
              <Label htmlFor='priority'>Priority</Label>
              <Select
                defaultValue={initialData?.priority || 'medium'}
                onValueChange={(value) =>
                  setValue('priority', value as 'low' | 'medium' | 'high')
                }
              >
                <SelectTrigger id='priority'>
                  <SelectValue placeholder='Select priority' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='low'>Low</SelectItem>
                  <SelectItem value='medium'>Medium</SelectItem>
                  <SelectItem value='high'>High</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className='grid gap-2'>
              <Label htmlFor='category'>Category</Label>
              <Select
                defaultValue={initialData?.category || 'General'}
                onValueChange={(value) => setValue('category', value)}
              >
                <SelectTrigger id='category'>
                  <SelectValue placeholder='Select category' />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.name}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button type='button' variant='outline'>
              Cancel
            </Button>
          </DialogClose>
          <Button type='submit'>
            {isEditMode ? 'Save Changes' : 'Add Chore'}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
