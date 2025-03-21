import React, { useState, useEffect } from 'react';
import { Chore, User } from '../../lib/types';
import ChoreList from './ChoreList';
import ChoreForm from './ChoreForm';
import ChoreDetail from './ChoreDetail';
import { getChores, deleteChore } from '../../lib/api/chores';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';

// Mock function for user retrieval - in a real app, this would come from an API
const getUsers = async (householdId: string): Promise<User[]> => {
  return [
    {
      id: '1',
      name: 'John Doe',
      email: 'john.doe@example.com',
      role: 'admin',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      role: 'member',
      household_id: '1',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ];
};

interface ChoreManagerProps {
  householdId: string;
}

type View = 'list' | 'detail' | 'create' | 'edit';

export default function ChoreManager({ householdId }: ChoreManagerProps) {
  const [view, setView] = useState<View>('list');
  const [selectedChore, setSelectedChore] = useState<Chore | null>(null);
  const [chores, setChores] = useState<Chore[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [choreData, userData] = await Promise.all([
        getChores(householdId),
        getUsers(householdId),
      ]);
      setChores(choreData);
      setUsers(userData);
      setError(null);
    } catch (err) {
      setError('Failed to load data. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [householdId]);

  const handleChoreSelect = (chore: Chore) => {
    setSelectedChore(chore);
    setView('detail');
  };

  const handleCreateChore = () => {
    setSelectedChore(null);
    setView('create');
  };

  const handleEditChore = (chore: Chore) => {
    setSelectedChore(chore);
    setView('edit');
  };

  const handleDeleteChore = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this chore?')) {
      return;
    }

    try {
      await deleteChore(id);
      setChores(chores.filter((chore) => chore.id !== id));
      setView('list');
    } catch (err) {
      console.error('Failed to delete chore:', err);
      alert('Failed to delete chore. Please try again.');
    }
  };

  const handleFormSuccess = () => {
    fetchData();
    setView('list');
  };

  if (loading) {
    return <div className='text-center py-8'>Loading chore management...</div>;
  }

  if (error) {
    return <div className='text-center py-8 text-red-500'>{error}</div>;
  }

  return (
    <div className='container mx-auto p-4'>
      {view === 'list' && (
        <div>
          <div className='flex justify-between items-center mb-6'>
            <h1 className='text-3xl font-bold'>Chore Management</h1>
            <Button onClick={handleCreateChore} variant='default'>
              Add New Chore
            </Button>
          </div>
          <ChoreList
            householdId={householdId}
            onChoreSelect={handleChoreSelect}
          />
        </div>
      )}

      {view === 'detail' && selectedChore && (
        <ChoreDetail
          chore={selectedChore}
          users={users}
          onBack={() => setView('list')}
          onEdit={() => handleEditChore(selectedChore)}
          onDelete={() => handleDeleteChore(selectedChore.id)}
        />
      )}

      {(view === 'create' || view === 'edit') && (
        <div>
          <Button
            onClick={() => setView(selectedChore ? 'detail' : 'list')}
            variant='ghost'
            className='p-0 mb-4 flex items-center text-blue-600 hover:text-blue-800'
          >
            <span>← Back</span>
          </Button>

          <ChoreForm
            householdId={householdId}
            chore={view === 'edit' ? selectedChore || undefined : undefined}
            users={users}
            onSuccess={handleFormSuccess}
            onCancel={() => setView(selectedChore ? 'detail' : 'list')}
          />
        </div>
      )}
    </div>
  );
}
