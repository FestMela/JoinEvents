import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserRole } from '../models/user.model';

export function authGuard(requiredRole: UserRole | UserRole[]): CanActivateFn {
  return (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    const auth = inject(AuthService);
    const router = inject(Router);
    if (!auth.isAuthenticated()) {
      router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
      return false;
    }
    const userRole = auth.getRole();
    const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    
    if (userRole && !roles.includes(userRole)) {
      const target = userRole === 'customer' ? '/dashboard' : `/${userRole}/dashboard`;
      router.navigate([target]);
      return false;
    }
    return true;
  };
}
