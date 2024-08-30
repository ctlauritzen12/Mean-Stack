import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Trip } from '../models/trip';
import { User } from '../models/user';
import { AuthResponse } from '../models/auth-response';
import { BROWSER_STORAGE } from '../storage';

@Injectable({
  providedIn: 'root'
})
export class TripDataService {
  url = 'http://localhost:3000/api/trips';
  baseUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient, @Inject(BROWSER_STORAGE) private storage: Storage) { }

  getTrips(): Observable<Trip[]> {
    return this.http.get<Trip[]>(this.url);
  }

  addTrip(formData: Trip): Observable<Trip> {
    return this.http.post<Trip>(this.url, formData);
  }

  getTrip(tripCode: string): Observable<Trip> {
    return this.http.get<Trip>(`${this.url}/${tripCode}`);
  }

  updateTrip(formData: Trip): Observable<Trip> {
    return this.http.put<Trip>(`${this.url}/${formData.code}`, formData);
  }

  login(user: User): Promise<AuthResponse> {
    const formData = {
      name: user.name,
      email: user.email,
      password: user.password
    };
    return this.http.post<AuthResponse>(`${this.baseUrl}/login`, formData).toPromise();
  }

  register(user: User): Promise<AuthResponse> {
    const formData = {
      name: user.name,
      email: user.email,
      password: user.password
    };
    return this.http.post<AuthResponse>(`${this.baseUrl}/register`, formData).toPromise();
  }
}

