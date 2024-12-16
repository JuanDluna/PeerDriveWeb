import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TripService {
  private baseUrl = 'http://192.168.100.82:3000/trips'; // Cambia esto por la URL de tu backend

  constructor(private http: HttpClient) {}

  addTrip(tripData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/addTrip`, tripData);
  }
}