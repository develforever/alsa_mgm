import { Route } from '@angular/router';

export const getRoute = (): Route => {
  return {
    path: 'dashboard',
    loadComponent: () => import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent),
    title: 'Dashboard',
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
