import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap, map, catchError } from 'rxjs/operators';
import { AuthUser, UserRole } from '../models/user.model';

const MOCK_USERS: Record<string, AuthUser & { password: string }> = {
  'customer@demo.com': { id: 'c1', name: 'Rajesh Kumar', email: 'customer@demo.com', role: 'customer', phone: '+91 98765 43210', password: 'JoinEvents@2025', token: 'mock-jwt-token-customer-123' },
  'meena@demo.com':    { id: 'c4', name: 'Meena Sharma', email: 'meena@demo.com', role: 'customer', phone: '+91 95432 10987', password: 'JoinEvents@2025', token: 'mock-jwt-token-customer-999' },
  'vendor@demo.com':   { id: 'v1', name: 'Amit Sharma', email: 'vendor@demo.com', role: 'vendor', phone: '+91 91234 56789', password: 'JoinEvents@2025', token: 'mock-jwt-token-vendor-456' },
  'admin@demo.com':    { id: 'a1', name: 'Priya Nair', email: 'admin@demo.com', role: 'admin', phone: '+91 99887 76655', password: 'JoinEvents@2025', token: 'mock-jwt-token-admin-789' },
  'support@demo.com':  { id: 's1', name: 'Rahul Support', email: 'support@demo.com', role: 'support', phone: '+91 99000 11223', password: 'JoinEvents@2025', token: 'mock-jwt-token-support-000' },
};

@Injectable({ providedIn: 'root' })
export class AuthService {
  private router = inject(Router);
  private http = inject(HttpClient);
  private apiUrl = 'https://localhost:7010/api/v1';

  currentUser = signal<AuthUser | null>(this.loadFromStorage());

  private loadFromStorage(): AuthUser | null {
    try {
      const stored = sessionStorage.getItem('joinevents_user');
      return stored ? JSON.parse(stored) : null;
    } catch { return null; }
  }

  login(email: string, password: string, role: UserRole, returnUrl?: string): Observable<{ success: boolean; message: string }> {
    // Clear any existing session first
    sessionStorage.removeItem('joinevents_user');
    this.currentUser.set(null);

    return this.http.post<any>(`${this.apiUrl}/auth/login`, { email, password, role }).pipe(
      map(response => {
        if (response && response.token) {
          const user: AuthUser = {
            id: response.user.id,
            name: response.user.name,
            email: response.user.email,
            role: response.user.role || role,
            token: response.token
          };
          sessionStorage.setItem('joinevents_user', JSON.stringify(user));
          this.currentUser.set(user);
          
          if (returnUrl) {
            this.router.navigateByUrl(returnUrl);
          } else {
            this.router.navigate([`/${user.role}/dashboard`]);
          }
          return { success: true, message: 'Login successful!' };
        }
        return { success: false, message: 'Invalid response from server.' };
      }),
      catchError(error => {
        let msg = 'Login failed.';
        if (error.error && error.error.error) msg = error.error.error;
        else if (error.message) msg = error.message;
        return of({ success: false, message: msg });
      })
    );
  }

  register(name: string, email: string, phone: string, password: string, role: UserRole): Observable<{ success: boolean; message: string }> {
    sessionStorage.removeItem('joinevents_user');
    this.currentUser.set(null);

    return this.http.post<any>(`${this.apiUrl}/auth/register`, { name, email, phone, password, role }).pipe(
      map(response => {
        if (response && response.token) {
          const user: AuthUser = {
            id: response.user.id,
            name: response.user.name,
            email: response.user.email,
            role: response.user.role || role,
            token: response.token
          };
          sessionStorage.setItem('joinevents_user', JSON.stringify(user));
          this.currentUser.set(user);
          this.router.navigate([`/${user.role}/dashboard`]);
          return { success: true, message: 'Registration successful!' };
        }
        return { success: false, message: 'Invalid response from server.' };
      }),
      catchError(error => {
        let msg = 'Registration failed.';
        if (error.error && error.error.error) msg = error.error.error;
        else if (error.message) msg = error.message;
        return of({ success: false, message: msg });
      })
    );
  }

  logout(): void {
    sessionStorage.removeItem('joinevents_user');
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean { return this.currentUser() !== null; }
  getRole(): UserRole | null { return this.currentUser()?.role ?? null; }
  hasRole(role: UserRole): boolean { return this.currentUser()?.role === role; }
}
