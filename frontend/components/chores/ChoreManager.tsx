import React, { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChoresProvider } from '@/context/ChoresContext';
import ChoreList from './ChoreList';
import ChoreFilters from './ChoreFilters';
import ChoreForm from './ChoreForm';
import ChoreStats from './ChoreStats';
import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';

interface ChoreManagerProps {
  householdId: string;
}

export default function ChoreManager({ householdId }: ChoreManagerProps) {
  const [showAddChore, setShowAddChore] = useState(false);

  return (
    <ChoresProvider>
      <div className='container mx-auto px-4 py-8'>
        <div className='flex justify-between items-center mb-6'>
          <h1 className='text-3xl font-bold text-gray-900'>Household Chores</h1>
          <Button
            onClick={() => setShowAddChore(true)}
            className='flex items-center gap-2'
          >
            <PlusIcon className='h-4 w-4' /> Add Chore
          </Button>
        </div>

        <Tabs defaultValue='all' className='w-full'>
          <TabsList className='grid w-full grid-cols-4 mb-8'>
            <TabsTrigger value='all'>All Chores</TabsTrigger>
            <TabsTrigger value='todo'>To Do</TabsTrigger>
            <TabsTrigger value='completed'>Completed</TabsTrigger>
            <TabsTrigger value='stats'>Statistics</TabsTrigger>
          </TabsList>

          <TabsContent value='all' className='space-y-4'>
            <ChoreFilters />
            <ChoreList householdId={householdId} filterCompleted={null} />
          </TabsContent>

          <TabsContent value='todo' className='space-y-4'>
            <ChoreFilters />
            <ChoreList householdId={householdId} filterCompleted={false} />
          </TabsContent>

          <TabsContent value='completed' className='space-y-4'>
            <ChoreFilters />
            <ChoreList householdId={householdId} filterCompleted={true} />
          </TabsContent>

          <TabsContent value='stats' className='space-y-4'>
            <ChoreStats householdId={householdId} />
          </TabsContent>
        </Tabs>

        {showAddChore && (
          <ChoreForm
            householdId={householdId}
            onClose={() => setShowAddChore(false)}
          />
        )}
      </div>
    </ChoresProvider>
  );
}
