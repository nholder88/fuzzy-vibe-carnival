import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Chore } from '../store/chores/chores.state';

@Injectable({
  providedIn: 'root',
})
export class ChoresService {
  private apiUrl = `${environment.apiUrl}/chores`;

  constructor(private http: HttpClient) {}

  getChores(householdId: string): Observable<Chore[]> {
    return this.http.get<Chore[]>(`${this.apiUrl}?householdId=${householdId}`);
  }

  getChoreById(id: string): Observable<Chore> {
    return this.http.get<Chore>(`${this.apiUrl}/${id}`);
  }

  createChore(data: {
    householdId: string;
    title: string;
    description?: string;
    assignedTo?: string;
    dueDate?: string;
    priority: 'low' | 'medium' | 'high';
    recurrence?: {
      frequency: 'daily' | 'weekly' | 'monthly';
      interval: number;
    };
  }): Observable<Chore> {
    return this.http.post<Chore>(this.apiUrl, data);
  }

  updateChore(id: string, changes: Partial<Chore>): Observable<Chore> {
    return this.http.patch<Chore>(`${this.apiUrl}/${id}`, changes);
  }

  deleteChore(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  completeChore(id: string): Observable<Chore> {
    return this.http.post<Chore>(`${this.apiUrl}/${id}/complete`, {});
  }
}
