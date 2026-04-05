import { Routes } from "@angular/router";

import { getRoute as homeRoute } from "./feature/home/home.routes";
import { getRoute as assemblyLineRoute } from "./feature/assembly/assembly.routes";
import { getRoute as dashboardRoute } from "./feature/dashboard/dashboard.routes";
import { getRoute as productionRoute } from "./feature/production/production.routes";

const home = homeRoute();

const children = [
  dashboardRoute(),
  assemblyLineRoute(),
  productionRoute(),
];

const menuItems = [
  {
    label: 'Logi audytu',
    link: '/audit-logs',
    icon: 'receipt',
    requiresAuth: true
  },
  {
    label: 'Zarządzanie użytkownikami',
    link: '/users',
    icon: 'people',
    requiresAuth: true,
    requiresAdmin: true
  }
];

children.forEach((e) => {

  const menuItem = e.data?.['manuItem'];

  const moduleItem = {
    label: menuItem?.label ?? e.title,
    icon: menuItem?.icon ?? 'precision_manufacturing',
    link: menuItem?.link ?? `./${e.path}`,
    requiresAuth: e.data?.['requiresAuth'] ?? true,
    menuItems: menuItem?.menuItems ?? []
  };
  menuItems.push(moduleItem);
});

children.push(home);


export const routes: Routes = [
  {
    path: '',
    title: 'Home',
    data: { menuItems },
    children
  }
];
