import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CalendarIcon, Edit2Icon, Trash2Icon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import ChoreForm from './ChoreForm';
import { Chore, HouseholdMember } from '@/types/chores';
import { format } from 'date-fns';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { choreService } from '@/lib/services/chore-service';

interface ChoreCardProps {
  chore: Chore;
  assignedMember: HouseholdMember | null;
  onMarkCompleted: (id: string, completed: boolean) => void;
  onDelete: (id: string) => void;
  householdId: string;
}

type ChoreStatus = 'pending' | 'in_progress' | 'completed';

const getPriorityColor = (priority: Chore['priority']) => {
  switch (priority) {
    case 'high':
      return 'bg-red-100 text-red-800';
    case 'medium':
      return 'bg-yellow-100 text-yellow-800';
    case 'low':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const formatDueDate = (dueDate: string | null) => {
  if (!dueDate) return 'No due date';
  return format(new Date(dueDate), 'MMM d, yyyy');
};

const getStatusText = (status: ChoreStatus) => {
  switch (status) {
    case 'in_progress':
      return 'In Progress';
    case 'completed':
      return 'Completed';
    case 'pending':
    default:
      return 'Pending';
  }
};

export default function ChoreCard({
  chore,
  assignedMember,
  onMarkCompleted,
  onDelete,
  householdId,
}: ChoreCardProps) {
  // Initialize with a default status based on the completed flag
  const [status, setStatus] = React.useState<ChoreStatus>(
    chore.completed ? 'completed' : 'pending'
  );

  const handleStatusChange = async (newStatus: ChoreStatus) => {
    try {
      setStatus(newStatus);

      // Determine if the chore is completed based on the status
      const completed = newStatus === 'completed';

      // Update the completed status if needed
      if (completed !== chore.completed) {
        onMarkCompleted(chore.id, completed);
      }

      // Update the status via API
      await choreService.updateChoreStatus(chore.id, newStatus);

      // Optional: Emit WebSocket event if needed
      // We can implement this later
    } catch (error) {
      console.error(`Error updating chore status ${chore.id}:`, error);
      // Revert status on error
      setStatus(chore.completed ? 'completed' : 'pending');
    }
  };

  return (
    <Card
      key={chore.id}
      className={`overflow-hidden ${chore.completed ? 'bg-gray-50' : ''}`}
      data-testid={`chore-card-${chore.id}`}
    >
      <CardContent className='p-6'>
        <div className='flex items-center gap-4'>
          <Checkbox
            id={`chore-${chore.id}`}
            checked={chore.completed}
            onCheckedChange={(checked) =>
              onMarkCompleted(chore.id, checked as boolean)
            }
          />
          <div className='flex-1 space-y-2'>
            <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between'>
              <label
                htmlFor={`chore-${chore.id}`}
                className={`text-lg font-medium ${
                  chore.completed ? 'line-through text-gray-400' : ''
                }`}
              >
                {chore.title}
              </label>
              <div className='flex items-center gap-2'>
                <Select
                  value={status}
                  onValueChange={(value) =>
                    handleStatusChange(value as ChoreStatus)
                  }
                >
                  <SelectTrigger className='w-[140px]'>
                    <SelectValue placeholder='Select status' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='pending'>Pending</SelectItem>
                    <SelectItem value='in_progress'>In Progress</SelectItem>
                    <SelectItem value='completed'>Completed</SelectItem>
                  </SelectContent>
                </Select>
                <Badge className={getPriorityColor(chore.priority)}>
                  {chore.priority} priority
                </Badge>
              </div>
            </div>
            {chore.description && (
              <p className='text-gray-500 text-sm'>{chore.description}</p>
            )}
            <div className='flex flex-wrap items-center gap-3 text-sm text-gray-500'>
              {chore.dueDate && (
                <div className='flex items-center gap-1'>
                  <CalendarIcon className='h-4 w-4' />
                  <span>{formatDueDate(chore.dueDate)}</span>
                </div>
              )}
              {chore.category && (
                <Badge variant='outline'>{chore.category}</Badge>
              )}
              {assignedMember && (
                <div className='flex items-center gap-2'>
                  <Avatar className='h-6 w-6'>
                    <AvatarImage
                      src={assignedMember.avatar || ''}
                      alt={assignedMember.name}
                    />
                    <AvatarFallback>
                      {assignedMember.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <span>{assignedMember.name}</span>
                </div>
              )}
            </div>
          </div>
          <div className='flex items-center space-x-2'>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant='ghost' size='icon' aria-label='Edit chore'>
                  <Edit2Icon className='h-4 w-4' />
                </Button>
              </DialogTrigger>
              <ChoreForm
                householdId={householdId}
                choreId={chore.id}
                initialData={chore}
              />
            </Dialog>
            <Button
              variant='ghost'
              size='icon'
              aria-label='Delete chore'
              className='text-red-500 hover:text-red-700 hover:bg-red-50'
              onClick={() => onDelete(chore.id)}
            >
              <Trash2Icon className='h-4 w-4' />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
