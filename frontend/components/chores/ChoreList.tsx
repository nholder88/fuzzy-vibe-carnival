import { useState, useEffect } from 'react';
import { Chore } from '../../lib/types';
import { getChores } from '../../lib/api/chores';
import ChoreItem from './ChoreItem';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Button } from '../ui/button';

type ChoreListProps = {
  householdId: string;
  onChoreSelect?: (chore: Chore) => void;
};

export default function ChoreList({
  householdId,
  onChoreSelect,
}: ChoreListProps) {
  const [chores, setChores] = useState<Chore[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<
    'all' | 'pending' | 'in_progress' | 'completed'
  >('all');

  useEffect(() => {
    const fetchChores = async () => {
      try {
        setLoading(true);
        const data = await getChores(householdId);
        setChores(data);
        setError(null);
      } catch (err) {
        setError('Failed to load chores. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchChores();
  }, [householdId]);

  const filteredChores =
    filter === 'all'
      ? chores
      : chores.filter((chore) => chore.status === filter);

  if (loading) {
    return <div className='text-center py-8'>Loading chores...</div>;
  }

  if (error) {
    return <div className='text-center py-8 text-red-500'>{error}</div>;
  }

  if (chores.length === 0) {
    return (
      <div className='text-center py-8'>
        No chores found. Create your first chore!
      </div>
    );
  }

  return (
    <div>
      <div className='flex justify-between items-center mb-6'>
        <h2 className='text-2xl font-semibold'>Household Chores</h2>
        <Tabs
          defaultValue={filter}
          onValueChange={(value) =>
            setFilter(value as 'all' | 'pending' | 'in_progress' | 'completed')
          }
        >
          <TabsList>
            <TabsTrigger value='all'>All</TabsTrigger>
            <TabsTrigger value='pending'>Pending</TabsTrigger>
            <TabsTrigger value='in_progress'>In Progress</TabsTrigger>
            <TabsTrigger value='completed'>Completed</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className='space-y-4'>
        {filteredChores.map((chore) => (
          <ChoreItem
            key={chore.id}
            chore={chore}
            onClick={() => onChoreSelect && onChoreSelect(chore)}
          />
        ))}
      </div>
    </div>
  );
}
