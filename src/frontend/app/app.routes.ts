import { Routes } from "@angular/router";

import { getRoute as homeRoute } from "./feature/home/home.routes";
import { getRoute as assemblyLineRoute } from "./feature/assembly/assembly.routes";


const children = [
  homeRoute(),
  assemblyLineRoute()
];

export const routes: Routes = [
  {
    path: '',
    children
  }
];
