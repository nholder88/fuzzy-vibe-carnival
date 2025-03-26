import React, { useEffect } from 'react';
import { useChores } from '@/context/ChoresContext';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { ChoreFilterOptions } from '@/types/chores';

export default function ChoreFilters() {
  const { filters, setFilters, householdMembers, categories } = useChores();

  const handleFilterChange = (
    key: keyof ChoreFilterOptions,
    value: string | undefined
  ) => {
    setFilters({ ...filters, [key]: value === 'all' ? undefined : value });
  };

  return (
    <div className='bg-white p-4 rounded-lg shadow-sm border border-gray-100'>
      <h3 className='text-lg font-medium mb-4'>Filter Chores</h3>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        <div className='space-y-2'>
          <Label htmlFor='assignedTo'>Assigned To</Label>
          <Select
            value={filters.assignedTo || 'all'}
            onValueChange={(value) => handleFilterChange('assignedTo', value)}
          >
            <SelectTrigger id='assignedTo'>
              <SelectValue placeholder='All Members' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>All Members</SelectItem>
              {householdMembers.map((member) => (
                <SelectItem key={member.id} value={member.id}>
                  {member.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className='space-y-2'>
          <Label htmlFor='priority'>Priority</Label>
          <Select
            value={filters.priority || 'all'}
            onValueChange={(value) =>
              handleFilterChange('priority', value as any)
            }
          >
            <SelectTrigger id='priority'>
              <SelectValue placeholder='All Priorities' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>All Priorities</SelectItem>
              <SelectItem value='high'>High</SelectItem>
              <SelectItem value='medium'>Medium</SelectItem>
              <SelectItem value='low'>Low</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className='space-y-2'>
          <Label htmlFor='category'>Category</Label>
          <Select
            value={filters.category || 'all'}
            onValueChange={(value) => handleFilterChange('category', value)}
          >
            <SelectTrigger id='category'>
              <SelectValue placeholder='All Categories' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>All Categories</SelectItem>
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
  );
}
