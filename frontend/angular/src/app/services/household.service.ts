import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  Household,
  HouseholdMember,
  HouseholdActivity,
} from '../models/household.model';

@Injectable({
  providedIn: 'root',
})
export class HouseholdService {
  private apiUrl = `${environment.householdServiceUrl}`;

  constructor(private http: HttpClient) {}

  // Household CRUD
  getHouseholds(): Observable<Household[]> {
    return this.http.get<Household[]>(this.apiUrl);
  }

  getHouseholdById(id: string): Observable<Household> {
    return this.http.get<Household>(`${this.apiUrl}/${id}`);
  }

  createHousehold(data: {
    name: string;
    description?: string;
  }): Observable<Household> {
    return this.http.post<Household>(this.apiUrl, data);
  }

  updateHousehold(
    id: string,
    changes: Partial<Household>
  ): Observable<Household> {
    return this.http.patch<Household>(`${this.apiUrl}/${id}`, changes);
  }

  deleteHousehold(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Member Management
  addMember(
    householdId: string,
    userId: string,
    role: string
  ): Observable<HouseholdMember> {
    return this.http.post<HouseholdMember>(
      `${this.apiUrl}/${householdId}/members`,
      {
        userId,
        role,
      }
    );
  }

  removeMember(householdId: string, memberId: string): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/${householdId}/members/${memberId}`
    );
  }

  updateMemberRole(
    householdId: string,
    memberId: string,
    role: string
  ): Observable<HouseholdMember> {
    return this.http.patch<HouseholdMember>(
      `${this.apiUrl}/${householdId}/members/${memberId}`,
      { role }
    );
  }

  // Activity Tracking
  getActivities(householdId: string): Observable<HouseholdActivity[]> {
    return this.http.get<HouseholdActivity[]>(
      `${this.apiUrl}/${householdId}/activities`
    );
  }

  createActivity(
    householdId: string,
    data: {
      type: string;
      description: string;
    }
  ): Observable<HouseholdActivity> {
    return this.http.post<HouseholdActivity>(
      `${this.apiUrl}/${householdId}/activities`,
      data
    );
  }
}
