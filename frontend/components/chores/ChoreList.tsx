import { useState, useEffect } from 'react';
import { Chore } from '../../lib/types';
import { getChores } from '../../lib/api/chores';
import ChoreItem from './ChoreItem';

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

  const handleFilterChange = (
    newFilter: 'all' | 'pending' | 'in_progress' | 'completed'
  ) => {
    setFilter(newFilter);
  };

  if (loading) {
    return <div className='w-full text-center py-8'>Loading chores...</div>;
  }

  if (error) {
    return <div className='w-full text-center py-8 text-red-500'>{error}</div>;
  }

  if (chores.length === 0) {
    return (
      <div className='w-full text-center py-8'>
        No chores found. Create your first chore!
      </div>
    );
  }

  return (
    <div className='w-full'>
      <div className='flex justify-between items-center mb-6'>
        <h2 className='text-2xl font-semibold'>Household Chores</h2>
        <div className='flex space-x-2'>
          <button
            className={`px-3 py-1 rounded ${
              filter === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
            onClick={() => handleFilterChange('all')}
          >
            All
          </button>
          <button
            className={`px-3 py-1 rounded ${
              filter === 'pending' ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
            onClick={() => handleFilterChange('pending')}
          >
            Pending
          </button>
          <button
            className={`px-3 py-1 rounded ${
              filter === 'in_progress'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200'
            }`}
            onClick={() => handleFilterChange('in_progress')}
          >
            In Progress
          </button>
          <button
            className={`px-3 py-1 rounded ${
              filter === 'completed' ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
            onClick={() => handleFilterChange('completed')}
          >
            Completed
          </button>
        </div>
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
