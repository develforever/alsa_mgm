import { Route } from '@angular/router';
import { authGuard } from '../../guards/auth.guard';

export const getRoute = (): Route => {
  return {
    path: 'dashboard',
    loadComponent: () => import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent),
    title: 'MENU.DASHBOARD',
    canActivate: [authGuard],
    data: {
      manuItem: {
        label: 'MENU.DASHBOARD',
        link: '/dashboard',
        icon: 'dashboard',
        menuItems: []
      }
    }
  };
};
