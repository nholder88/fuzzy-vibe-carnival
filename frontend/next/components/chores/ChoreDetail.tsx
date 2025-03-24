import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { ArrowLeft, Clock, Edit, Trash2, AlertTriangle } from 'lucide-react';

type ChoreStatus = 'pending' | 'in_progress' | 'completed';
type ChorePriority = 'low' | 'medium' | 'high';
type ChoreRecurrence = 'daily' | 'weekly' | 'monthly' | 'none';

interface User {
  id: string;
  name: string;
}

interface Chore {
  id: string;
  title: string;
  description?: string;
  priority: ChorePriority;
  status: ChoreStatus;
  due_date?: string;
  recurring: ChoreRecurrence;
  assigned_to?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  completed_at?: string | null;
}

interface ChoreDetailProps {
  chore: Chore;
  users: User[];
  onBack: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export default function ChoreDetail({
  chore,
  users,
  onBack,
  onEdit,
  onDelete,
}: ChoreDetailProps) {
  // Helper function to get user name by ID
  const getUserName = (userId?: string) => {
    if (!userId) return 'Unassigned';
    const user = users.find((user) => user.id === userId);
    return user ? user.name : 'Unknown User';
  };

  // Helper function to format date
  const formatDate = (dateString?: string | null) => {
    if (!dateString) return 'Not set';
    return format(new Date(dateString), 'PPP p');
  };

  // Determine if the chore is overdue
  const isOverdue = () => {
    if (chore.status === 'completed' || !chore.due_date) return false;
    const dueDate = new Date(chore.due_date);
    return dueDate < new Date();
  };

  // Get status badge color
  const getStatusColor = () => {
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

  // Get priority badge color
  const getPriorityColor = () => {
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
    <Card className='w-full max-w-3xl mx-auto'>
      <CardHeader className='pb-2'>
        <div className='flex items-start justify-between'>
          <Button
            variant='ghost'
            size='icon'
            onClick={onBack}
            className='mr-2 -ml-3 -mt-1'
          >
            <ArrowLeft className='h-5 w-5' />
          </Button>
          <CardTitle className='text-2xl flex-grow'>{chore.title}</CardTitle>
          <div className='flex gap-2'>
            <Button variant='outline' size='icon' onClick={onEdit}>
              <Edit className='h-4 w-4' />
            </Button>
            <Button
              variant='outline'
              size='icon'
              onClick={onDelete}
              className='text-destructive'
            >
              <Trash2 className='h-4 w-4' />
            </Button>
          </div>
        </div>
        <div className='flex flex-wrap gap-2 mt-2'>
          <Badge className={getStatusColor()}>
            {chore.status.replace('_', ' ').charAt(0).toUpperCase() +
              chore.status.replace('_', ' ').slice(1)}
          </Badge>
          <Badge className={getPriorityColor()}>
            {chore.priority.charAt(0).toUpperCase() + chore.priority.slice(1)}{' '}
            Priority
          </Badge>
          {isOverdue() && (
            <Badge variant='destructive' className='flex items-center gap-1'>
              <AlertTriangle className='h-3 w-3' />
              Overdue
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className='pt-4 pb-6'>
        {chore.description && (
          <div className='mb-6'>
            <h3 className='text-sm font-medium mb-1 text-muted-foreground'>
              Description
            </h3>
            <p className='text-base'>{chore.description}</p>
          </div>
        )}

        <div className='grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4'>
          <div>
            <h3 className='text-sm font-medium mb-1 text-muted-foreground'>
              Assigned To
            </h3>
            <p className='text-base'>{getUserName(chore.assigned_to)}</p>
          </div>

          {chore.due_date && (
            <div>
              <h3 className='text-sm font-medium mb-1 text-muted-foreground'>
                Due Date
              </h3>
              <p className='text-base flex items-center gap-1'>
                <Clock className='h-4 w-4 text-muted-foreground' />
                {formatDate(chore.due_date)}
              </p>
            </div>
          )}

          <div>
            <h3 className='text-sm font-medium mb-1 text-muted-foreground'>
              Recurrence
            </h3>
            <p className='text-base capitalize'>{chore.recurring}</p>
          </div>

          <div>
            <h3 className='text-sm font-medium mb-1 text-muted-foreground'>
              Created By
            </h3>
            <p className='text-base'>{getUserName(chore.created_by)}</p>
          </div>

          {chore.status === 'completed' && chore.completed_at && (
            <div>
              <h3 className='text-sm font-medium mb-1 text-muted-foreground'>
                Completed At
              </h3>
              <p className='text-base'>{formatDate(chore.completed_at)}</p>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className='pt-0 text-sm text-muted-foreground'>
        <div className='w-full flex flex-col gap-1'>
          <p>Created: {formatDate(chore.created_at)}</p>
          <p>Last Updated: {formatDate(chore.updated_at)}</p>
        </div>
      </CardFooter>
    </Card>
  );
}
