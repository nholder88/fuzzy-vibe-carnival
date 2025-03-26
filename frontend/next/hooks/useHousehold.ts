'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  createHousehold,
  getHouseholds,
  inviteToHousehold,
} from '@/lib/api/households';
import { useToast } from '@/components/ui/toast';
import { Household } from '@/lib/types';

export function useHousehold() {
  const [isLoading, setIsLoading] = useState(false);
  const [households, setHouseholds] = useState<Household[]>([]);
  const { showToast } = useToast();
  const router = useRouter();

  const handleCreateHousehold = async (name: string): Promise<void> => {
    setIsLoading(true);
    showToast('Creating household...', 'info');

    try {
      const household = await createHousehold(name);
      showToast(`Household ${household.name} created successfully!`, 'success');

      // Redirect to the dashboard or members page
      router.push('/dashboard');
    } catch (error) {
      console.error('Error creating household:', error);
      showToast('Failed to create household. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchHouseholds = async (): Promise<void> => {
    setIsLoading(true);

    try {
      const fetchedHouseholds = await getHouseholds();
      setHouseholds(fetchedHouseholds);
    } catch (error) {
      console.error('Error fetching households:', error);
      showToast('Failed to fetch households. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const inviteMember = async (
    householdId: string,
    email: string,
    role?: string
  ): Promise<void> => {
    setIsLoading(true);
    showToast('Sending invitation...', 'info');

    try {
      await inviteToHousehold(householdId, email, role);
      showToast('Invitation sent successfully!', 'success');
    } catch (error) {
      console.error('Error inviting member:', error);
      showToast('Failed to send invitation. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    households,
    createHousehold: handleCreateHousehold,
    fetchHouseholds,
    inviteMember,
  };
}
