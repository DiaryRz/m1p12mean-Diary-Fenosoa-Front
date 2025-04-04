import { CanActivateChildFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './services/auth.service';

export const AuthGuard: CanActivateChildFn = (childRoute, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const clearAuthDataAndRedirect = () => {
    const role = localStorage.getItem('role');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('role');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userId');
    router.navigate([ `/login`]);
  };

    // Attempt refresh if needed
  authService.refresh().subscribe({
    next: (val) => {
      if (val.success) {
        if (val.regenerate) {
          localStorage.setItem('accessToken', val.accessToken);
          localStorage.setItem('refreshToken', val.refreshToken);
          localStorage.setItem('role', val.role);
          localStorage.setItem('userId', val.userId);
        }
      } else if (val.error?.expire_refresh) {
        clearAuthDataAndRedirect();
      }
    },
    error: () => clearAuthDataAndRedirect()
  });


  return true;
};
