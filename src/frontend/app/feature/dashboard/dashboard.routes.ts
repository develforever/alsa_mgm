import { Route } from '@angular/router';
import { authGuard } from '../../guards/auth.guard';


export const getRoute = (): Route => {
  return {
    path: 'dashboard',
    loadComponent: () => import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent),
    title: 'Dashboard',
    canActivate: [authGuard],
    data: {
      manuItem: {
        label: 'Dashboard',
        link: '/dashboard',
        icon: 'dashboard',
        menuItems: []
      }
    }
  };
};
