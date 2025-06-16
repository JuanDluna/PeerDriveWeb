import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = `${environment.backendUrl}/usuarios`;

  constructor(private http: HttpClient) {}

login(email: string, password: string): Observable<any> {
  return this.http.post(`${this.baseUrl}/login`, { email, password }).pipe(
    map((res: any) => {
      console.log('Respuesta del backend:', res); // 👈 Agrega esto

      if (!res || !res.user || !res.user.id) {
        throw new Error("Unexpected response structure.");
      }

      this.saveSession(res.user.id, res.user.tipo_usuario, res.user.nombre);
      return res;
    }),
    catchError(this.handleError)
  );
}


  register(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, data).pipe(
      map((res: any) => res),
      catchError(this.handleError)
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('name');
  }

  saveSession(token: string, role: string, name: string): void {
    localStorage.setItem('token', token);
    localStorage.setItem('role', role);
    localStorage.setItem('name', name);
  }

  getRole(): string | null {
    return localStorage.getItem('role');
  }

  getName(): string | null {
    return localStorage.getItem('name');
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(() => new Error(errorMessage));
  }
}
