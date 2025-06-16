import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class TripService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.backendUrl}/viajes`;

  getTrips(): Observable<any> {
    return this.http.get(this.baseUrl);
  }

  // addTrip(data: any): Observable<any> {
  //   return this.http.post(`${this.baseUrl}/addTrip`, data);
  // }

  updateTripStatus(id: number, status: string): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, { status });
  }

  addTrip(tripData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/addTrip`, tripData);
  }
  findTrips(origin: { lat: number, lng: number }, destination: { lat: number, lng: number }): Observable<any> {
    const body = { origin, destination };
    return this.http.post(`${this.baseUrl}/find`, body);
  }

  addUserInTrip(tripId: string, userId: string): Observable<any> {
    const body = { tripId, userId };
    return this.http.post(`${this.baseUrl}/addUserInTrip`, body);
  }
}
