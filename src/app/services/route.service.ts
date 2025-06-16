import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class RouteService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.backendUrl}/rutas`;

  getRoutes(): Observable<any> {
    return this.http.get(this.baseUrl);
  }

  calculateRoute(origin: string, destination: string): Observable<any> {
    const params = new HttpParams().set('origin', origin).set('destination', destination);
    return this.http.get(`${this.baseUrl}/calculate-route`, { params });
  }
}
