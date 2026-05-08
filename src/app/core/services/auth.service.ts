import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { inject } from '@angular/core';
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

  currentUser = signal<AuthUser | null>(this.loadFromStorage());

  private loadFromStorage(): AuthUser | null {
    try {
      const stored = sessionStorage.getItem('joinevents_user');
      return stored ? JSON.parse(stored) : null;
    } catch { return null; }
  }

  login(email: string, password: string, role: UserRole, returnUrl?: string): { success: boolean; message: string } {
    // Clear any existing session first
    sessionStorage.removeItem('joinevents_user');
    this.currentUser.set(null);

    const user = MOCK_USERS[email.toLowerCase()];
    if (!user) return { success: false, message: 'Email not found.' };
    if (user.password !== password) return { success: false, message: 'Incorrect password.' };
    if (user.role !== role) return { success: false, message: `This account is registered as a ${user.role}, not ${role}.` };
    
    const { password: _p, ...safeUser } = user;
    sessionStorage.setItem('joinevents_user', JSON.stringify(safeUser));
    this.currentUser.set(safeUser);
    
    if (returnUrl) {
      this.router.navigateByUrl(returnUrl);
    } else {
      this.router.navigate([`/${role}/dashboard`]);
    }
    return { success: true, message: 'Login successful!' };
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
