'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

// Form validation schema
const householdSchema = z.object({
  name: z.string().min(1, { message: 'Household name is required' }),
});

type HouseholdFormValues = z.infer<typeof householdSchema>;

interface CreateHouseholdDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: HouseholdFormValues) => Promise<void>;
  isLoading?: boolean;
}

export function CreateHouseholdDialog({
  open,
  onOpenChange,
  onSubmit,
  isLoading = false,
}: CreateHouseholdDialogProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<HouseholdFormValues>({
    resolver: zodResolver(householdSchema),
    defaultValues: {
      name: '',
    },
  });

  const handleFormSubmit = async (data: HouseholdFormValues) => {
    await onSubmit(data);
    if (!isLoading) {
      reset();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Create Household</DialogTitle>
          <DialogDescription>
            Create a new household to manage chores and tasks
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <div className='grid gap-4 py-4'>
            <div className='space-y-2'>
              <Label htmlFor='name'>Household Name</Label>
              <Input
                id='name'
                placeholder='Enter household name'
                {...register('name')}
                aria-invalid={errors.name ? 'true' : 'false'}
              />
              {errors.name && (
                <p className='text-sm text-destructive flex items-center gap-1'>
                  <AlertCircle className='h-4 w-4' />
                  {errors.name.message}
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button type='submit' disabled={isLoading}>
              {isLoading ? 'Creating...' : 'Create Household'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
