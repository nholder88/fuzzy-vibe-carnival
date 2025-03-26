'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { AlertCircle } from 'lucide-react';
import { useHousehold } from '@/hooks/useHousehold';

// Form validation schema
const householdSchema = z.object({
  name: z.string().min(1, { message: 'Household name is required' }),
});

type HouseholdFormValues = z.infer<typeof householdSchema>;

export function CreateHouseholdForm() {
  const { isLoading, createHousehold } = useHousehold();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<HouseholdFormValues>({
    resolver: zodResolver(householdSchema),
    defaultValues: {
      name: '',
    },
  });

  const handleFormSubmit = async (data: HouseholdFormValues) => {
    await createHousehold(data.name);
  };

  return (
    <Card className='w-full max-w-md mx-auto'>
      <CardHeader>
        <CardTitle className='text-2xl'>Create Household</CardTitle>
        <CardDescription>
          Create a new household to manage chores and tasks
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(handleFormSubmit)} className='space-y-4'>
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
          <Button type='submit' className='w-full' disabled={isLoading}>
            {isLoading ? 'Creating...' : 'Create Household'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
