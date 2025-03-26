import React, { useEffect, useState } from 'react';
import { useChores } from '@/context/ChoresContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { HouseholdMember } from '@/types/chores';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface ChoreStatsProps {
  householdId: string;
}

interface MemberStats {
  member: HouseholdMember;
  completed: number;
  pending: number;
  totalAssigned: number;
  completionRate: number;
}

export default function ChoreStats({ householdId }: ChoreStatsProps) {
  const { chores, householdMembers, fetchChores } = useChores();
  const [memberStats, setMemberStats] = useState<MemberStats[]>([]);
  const [categoryStats, setCategoryStats] = useState<{
    [category: string]: number;
  }>({});

  useEffect(() => {
    fetchChores(householdId);
  }, [householdId, fetchChores]);

  useEffect(() => {
    if (chores.length && householdMembers.length) {
      calculateStats();
    }
  }, [chores, householdMembers]);

  const calculateStats = () => {
    // Calculate member stats
    const memberStatsData: MemberStats[] = householdMembers.map((member) => {
      const memberChores = chores.filter(
        (chore) => chore.assignedTo === member.id
      );
      const completed = memberChores.filter((chore) => chore.completed).length;
      const pending = memberChores.filter((chore) => !chore.completed).length;
      const totalAssigned = memberChores.length;
      const completionRate =
        totalAssigned > 0 ? (completed / totalAssigned) * 100 : 0;

      return {
        member,
        completed,
        pending,
        totalAssigned,
        completionRate,
      };
    });

    // Calculate category stats
    const categoryCounts: { [category: string]: number } = {};
    chores.forEach((chore) => {
      if (!categoryCounts[chore.category]) {
        categoryCounts[chore.category] = 0;
      }
      categoryCounts[chore.category]++;
    });

    setMemberStats(memberStatsData);
    setCategoryStats(categoryCounts);
  };

  const getTotalChores = () => chores.length;
  const getCompletedChores = () =>
    chores.filter((chore) => chore.completed).length;
  const getPendingChores = () =>
    chores.filter((chore) => !chore.completed).length;
  const getCompletionRate = () => {
    return getTotalChores() > 0
      ? ((getCompletedChores() / getTotalChores()) * 100).toFixed(1)
      : '0';
  };
  const getHighPriorityCount = () =>
    chores.filter((chore) => chore.priority === 'high' && !chore.completed)
      .length;

  return (
    <div className='space-y-6'>
      <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
        <Card>
          <CardHeader className='pb-2'>
            <CardTitle className='text-sm font-medium text-gray-500'>
              Total Chores
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-3xl font-bold'>{getTotalChores()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='pb-2'>
            <CardTitle className='text-sm font-medium text-gray-500'>
              Completed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-3xl font-bold text-green-600'>
              {getCompletedChores()}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='pb-2'>
            <CardTitle className='text-sm font-medium text-gray-500'>
              Pending
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-3xl font-bold text-amber-600'>
              {getPendingChores()}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='pb-2'>
            <CardTitle className='text-sm font-medium text-gray-500'>
              Completion Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-3xl font-bold'>{getCompletionRate()}%</div>
          </CardContent>
        </Card>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <Card>
          <CardHeader>
            <CardTitle>Member Performance</CardTitle>
          </CardHeader>
          <CardContent>
            {memberStats.length === 0 ? (
              <p className='text-gray-500'>No data available</p>
            ) : (
              <div className='space-y-4'>
                {memberStats.map((stat) => (
                  <div
                    key={stat.member.id}
                    className='flex items-center justify-between'
                  >
                    <div className='flex items-center gap-2'>
                      <Avatar className='h-8 w-8'>
                        <AvatarImage
                          src={stat.member.avatar}
                          alt={stat.member.name}
                        />
                        <AvatarFallback>
                          {stat.member.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <span>{stat.member.name}</span>
                    </div>
                    <div className='flex items-center gap-4'>
                      <div className='text-sm'>
                        <span className='text-gray-500'>Completed:</span>{' '}
                        {stat.completed}
                      </div>
                      <div className='text-sm'>
                        <span className='text-gray-500'>Pending:</span>{' '}
                        {stat.pending}
                      </div>
                      <div>
                        <span className='font-medium'>
                          {stat.completionRate.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Categories</CardTitle>
          </CardHeader>
          <CardContent>
            {Object.keys(categoryStats).length === 0 ? (
              <p className='text-gray-500'>No data available</p>
            ) : (
              <div className='space-y-4'>
                {Object.entries(categoryStats)
                  .sort((a, b) => b[1] - a[1])
                  .map(([category, count]) => (
                    <div
                      key={category}
                      className='flex items-center justify-between'
                    >
                      <span>{category}</span>
                      <div className='flex items-center gap-2'>
                        <div className='h-2 bg-gray-100 rounded-full w-32 overflow-hidden'>
                          <div
                            className='h-full bg-primary'
                            style={{
                              width: `${(count / getTotalChores()) * 100}%`,
                            }}
                          ></div>
                        </div>
                        <span className='text-sm font-medium'>{count}</span>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {getHighPriorityCount() > 0 && (
        <Card className='bg-red-50 border-red-200'>
          <CardHeader className='pb-2'>
            <CardTitle className='text-red-800'>High Priority Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-red-600'>
              You have{' '}
              <span className='font-bold'>{getHighPriorityCount()}</span> high
              priority tasks that need attention.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
