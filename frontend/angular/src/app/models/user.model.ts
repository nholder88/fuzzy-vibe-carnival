export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}
