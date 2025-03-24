import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Chore {
  id: string;
  title: string;
  description: string;
  dueDate: Date;
  assignedTo: string;
  status: 'pending' | 'completed';
}

@Injectable({
  providedIn: 'root',
})
export class ChoresService {
  private apiUrl = `${environment.apiUrl}/chores`;

  // Mock chores data for initial development
  private mockChores: Chore[] = [
    {
      id: '1',
      title: 'Vacuum living room',
      description: 'Vacuum the carpet in the living room',
      dueDate: new Date('2024-03-25'),
      assignedTo: 'John',
      status: 'pending',
    },
    {
      id: '2',
      title: 'Wash dishes',
      description: 'Clean all dishes in the sink',
      dueDate: new Date('2024-03-24'),
      assignedTo: 'Mary',
      status: 'completed',
    },
    {
      id: '3',
      title: 'Take out trash',
      description: 'Take out all trash bags to the bin',
      dueDate: new Date('2024-03-24'),
      assignedTo: 'John',
      status: 'pending',
    },
  ];

  constructor(private http: HttpClient) {}

  // Get all chores
  getChores(): Observable<Chore[]> {
    // For development, use mock data instead of actual API call
    // TODO: Replace with HTTP call when API is ready
    // return this.http.get<Chore[]>(this.apiUrl);
    return of(this.mockChores);
  }

  // Get a single chore by ID
  getChore(id: string): Observable<Chore | undefined> {
    // TODO: Replace with HTTP call when API is ready
    // return this.http.get<Chore>(`${this.apiUrl}/${id}`);
    const chore = this.mockChores.find((c) => c.id === id);
    return of(chore);
  }

  // Create a new chore
  createChore(chore: Omit<Chore, 'id'>): Observable<Chore> {
    // TODO: Replace with HTTP call when API is ready
    // return this.http.post<Chore>(this.apiUrl, chore);
    const newChore: Chore = {
      ...chore,
      id: Date.now().toString(), // Generate a unique ID
    };
    this.mockChores.push(newChore);
    return of(newChore);
  }

  // Update an existing chore
  updateChore(
    id: string,
    chore: Partial<Chore>
  ): Observable<Chore | undefined> {
    // TODO: Replace with HTTP call when API is ready
    // return this.http.put<Chore>(`${this.apiUrl}/${id}`, chore);
    const index = this.mockChores.findIndex((c) => c.id === id);
    if (index !== -1) {
      this.mockChores[index] = { ...this.mockChores[index], ...chore };
      return of(this.mockChores[index]);
    }
    return of(undefined);
  }

  // Delete a chore
  deleteChore(id: string): Observable<boolean> {
    // TODO: Replace with HTTP call when API is ready
    // return this.http.delete(`${this.apiUrl}/${id}`);
    const index = this.mockChores.findIndex((c) => c.id === id);
    if (index !== -1) {
      this.mockChores.splice(index, 1);
      return of(true);
    }
    return of(false);
  }

  // Toggle chore status between pending and completed
  toggleChoreStatus(id: string): Observable<Chore | undefined> {
    const index = this.mockChores.findIndex((c) => c.id === id);
    if (index !== -1) {
      const currentStatus = this.mockChores[index].status;
      const newStatus = currentStatus === 'completed' ? 'pending' : 'completed';
      this.mockChores[index] = { ...this.mockChores[index], status: newStatus };
      return of(this.mockChores[index]);
    }
    return of(undefined);
  }
}
