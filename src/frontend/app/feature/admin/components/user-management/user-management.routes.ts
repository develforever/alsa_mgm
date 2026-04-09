import { Route } from '@angular/router';
import { authGuard } from '../../../../guards/auth.guard';

export const getRoute = (): Route => {
  return {
    path: 'users',
    loadComponent: () => import('./user-management.component').then(m => m.UserManagementComponent),
    canActivate: [authGuard],
    title: 'Zarządzanie użytkownikami',
    data: {
      requiresAdmin: true
    }
  };
};
