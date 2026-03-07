import { Routes } from "@angular/router";

import { getRoute as homeRoute } from "./feature/home/home.routes";
import { getRoute as assemblyLineRoute } from "./feature/assembly/assembly.routes";

const home = homeRoute();

const children = [
  assemblyLineRoute()
];

const menuItems = home?.data?.['menuItems'];

children.forEach((e) => {

  const menuItem = e.data?.['manuItem'];

  const moduleItem = {
    label: menuItem?.label ?? e.title,
    icon: menuItem?.icon ?? 'precision_manufacturing',
    link: menuItem?.link ?? `./${e.path}`
  };
  menuItems.push(moduleItem);

});


children.push(home);


export const routes: Routes = [
  {
    path: '',
    title: 'Home',
    children
  }
];
