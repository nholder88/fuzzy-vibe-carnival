import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Clock, User } from 'lucide-react';

type ChoreStatus = 'pending' | 'in_progress' | 'completed';
type ChorePriority = 'low' | 'medium' | 'high';

interface ChoreProps {
  id: string;
  title: string;
  description?: string;
  priority: ChorePriority;
  status: ChoreStatus;
  due_date?: string;
  recurring?: string;
  assigned_to?: string;
}

interface ChoreItemProps {
  chore: ChoreProps;
  onClick?: () => void;
}

export default function ChoreItem({ chore, onClick }: ChoreItemProps) {
  // Determine if the chore is overdue
  const isOverdue = () => {
    if (chore.status === 'completed' || !chore.due_date) return false;
    const dueDate = new Date(chore.due_date);
    return dueDate < new Date();
  };

  // Format the due date
  const formatDueDate = (dateString?: string) => {
    if (!dateString) return null;
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (e) {
      return dateString;
    }
  };

  // Get status badge styling
  const getStatusBadgeClass = () => {
    switch (chore.status) {
      case 'completed':
        return 'bg-green-500 hover:bg-green-600';
      case 'in_progress':
        return 'bg-blue-500 hover:bg-blue-600';
      case 'pending':
        return 'bg-yellow-500 hover:bg-yellow-600';
      default:
        return '';
    }
  };

  // Get priority badge styling
  const getPriorityBadgeClass = () => {
    switch (chore.priority) {
      case 'high':
        return 'bg-red-500 hover:bg-red-600';
      case 'medium':
        return 'bg-orange-500 hover:bg-orange-600';
      case 'low':
        return 'bg-green-500 hover:bg-green-600';
      default:
        return '';
    }
  };

  return (
    <Card
      className='overflow-hidden hover:shadow-md transition-shadow cursor-pointer'
      onClick={onClick}
    >
      <CardContent className='p-4'>
        <div className='space-y-2'>
          <div className='flex justify-between items-start'>
            <h3 className='font-medium text-lg'>{chore.title}</h3>
            <div className='flex flex-wrap gap-2'>
              <Badge className={getStatusBadgeClass()}>
                {chore.status.replace('_', ' ').charAt(0).toUpperCase() +
                  chore.status.replace('_', ' ').slice(1)}
              </Badge>
              <Badge className={getPriorityBadgeClass()}>
                {chore.priority.charAt(0).toUpperCase() +
                  chore.priority.slice(1)}
              </Badge>
            </div>
          </div>

          {chore.description && (
            <p className='text-sm text-muted-foreground line-clamp-2'>
              {chore.description}
            </p>
          )}

          <div className='flex flex-wrap items-center gap-3 pt-2'>
            {chore.due_date && (
              <div className='flex items-center gap-1 text-sm text-muted-foreground'>
                <Clock className='h-3.5 w-3.5' />
                <span
                  className={isOverdue() ? 'text-destructive font-medium' : ''}
                >
                  {formatDueDate(chore.due_date)}
                  {isOverdue() && ' (Overdue)'}
                </span>
              </div>
            )}

            {chore.assigned_to && (
              <div className='flex items-center gap-1 text-sm text-muted-foreground'>
                <User className='h-3.5 w-3.5' />
                <span>{chore.assigned_to}</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
