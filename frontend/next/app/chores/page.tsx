'use client';

import ChoreManager from '../../components/chores/ChoreManager';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

export default function ChoresPage() {
  // In a real application, this would come from auth context or state
  const householdId = '1';

  return (
    <ProtectedRoute>
      <main className='min-h-screen bg-gray-50'>
        <ChoreManager householdId={householdId} />
      </main>
    </ProtectedRoute>
  );
}
