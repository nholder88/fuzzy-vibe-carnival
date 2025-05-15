export interface Household {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  members: HouseholdMember[];
  activities: HouseholdActivity[];
}

export interface HouseholdMember {
  id: string;
  userId: string;
  householdId: string;
  role: HouseholdRole;
  joinedAt: Date;
  user: User;
}

export interface HouseholdActivity {
  id: string;
  householdId: string;
  userId: string;
  type: ActivityType;
  description: string;
  createdAt: Date;
  user: User;
}

export enum HouseholdRole {
  ADMIN = 'ADMIN',
  MEMBER = 'MEMBER',
}

export enum ActivityType {
  MEMBER_JOINED = 'MEMBER_JOINED',
  MEMBER_LEFT = 'MEMBER_LEFT',
  SETTINGS_UPDATED = 'SETTINGS_UPDATED',
  TASK_CREATED = 'TASK_CREATED',
  TASK_COMPLETED = 'TASK_COMPLETED',
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
}
