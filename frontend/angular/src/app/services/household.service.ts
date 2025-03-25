import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Household } from '../store/household/household.state';

@Injectable({
  providedIn: 'root',
})
export class HouseholdService {
  private apiUrl = `${environment.apiUrl}/households`;

  constructor(private http: HttpClient) {}

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
}
