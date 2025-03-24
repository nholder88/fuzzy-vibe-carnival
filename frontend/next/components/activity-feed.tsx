'use client';

import { useState, useEffect } from 'react';
import EmptyState from '@/components/ui/empty-state';

interface Activity {
  id: string;
  type: string;
  description: string;
  timestamp: string;
  user: string;
}

export default function ActivityFeed() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    // Skip this effect during SSR
    if (!isClient) return;

    // Simulate fetching data
    const fetchActivities = async () => {
      try {
        // In a real app, this would be an API call
        // For now, let's simulate with mock data
        const mockActivities: Activity[] = [
          {
            id: '1',
            type: 'chore',
            description: 'Completed "Wash Dishes" chore',
            timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
            user: 'John Doe',
          },
          {
            id: '2',
            type: 'inventory',
            description: 'Added "Milk" to inventory',
            timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
            user: 'Jane Smith',
          },
          {
            id: '3',
            type: 'shopping',
            description: 'Created new shopping list',
            timestamp: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
            user: 'Mike Johnson',
          },
        ];

        // Simulate loading delay
        setTimeout(() => {
          setActivities(mockActivities);
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error('Error fetching activities:', error);
        setLoading(false);
      }
    };

    fetchActivities();
  }, [isClient]);

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return new Intl.RelativeTimeFormat('en', { numeric: 'auto' }).format(
      Math.floor((date.getTime() - Date.now()) / 1000 / 60),
      'minute'
    );
  };

  if (loading) {
    return (
      <div className='flex justify-center items-center h-40'>
        <div className='animate-spin rounded-full h-10 w-10 border-b-2 border-blue-700'></div>
      </div>
    );
  }

  if (activities.length === 0) {
    return <EmptyState message='No recent activity found' />;
  }

  return (
    <div className='space-y-4'>
      <h2 className='text-2xl font-semibold mb-4'>Recent Activity</h2>
      <ul className='divide-y divide-gray-200'>
        {activities.map((activity: Activity) => (
          <li key={activity.id} className='py-4 flex'>
            <div className='ml-3 flex-1'>
              <p className='text-sm font-medium text-gray-900'>
                {activity.user}
              </p>
              <p className='text-sm text-gray-500'>{activity.description}</p>
              <p className='text-xs text-gray-400 mt-1'>
                {isClient
                  ? new Date(activity.timestamp).toLocaleString()
                  : activity.timestamp}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
