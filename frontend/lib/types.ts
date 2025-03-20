export type Chore = {
  id: string;
  title: string;
  description?: string;
  assigned_to?: string;
  household_id: string;
  status: 'pending' | 'in_progress' | 'completed';
  due_date?: string;
  priority: 'low' | 'medium' | 'high';
  recurring: 'none' | 'daily' | 'weekly' | 'monthly';
  completed_at?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'member';
  household_id?: string;
  created_at: string;
  updated_at: string;
};

export type Household = {
  id: string;
  name: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
};
