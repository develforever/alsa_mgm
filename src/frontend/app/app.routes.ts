import { Routes } from "@angular/router";
import { authGuard } from "./guards/auth.guard";
import { LoginComponent } from "./components/login/login.component";
import { ProductListComponent } from "./components/product-list/product-list.component";
import { AllocationViewComponent } from "./components/allocation-view/allocation-view.component";
import { LineListComponent } from "./components/line-list/line-list.component";
import { WorkstationListComponent } from "./components/workstation-list/workstation-list.component";
import { AuditLogComponent } from "./components/audit-log/audit-log.component";

export const routes: Routes = [
  { path: "login", component: LoginComponent, title: "Logowanie do systemu" },
  {
    path: "products",
    component: ProductListComponent,
    canActivate: [authGuard],
    title: "Produkty",
  },
  {
    path: "allocations",
    component: AllocationViewComponent,
    canActivate: [authGuard],
    title: "Alokacje",
  },
  {
    path: "lines",
    component: LineListComponent,
    canActivate: [authGuard],
    title: "Linie montażowe",
  },
  {
    path: "workstations",
    component: WorkstationListComponent,
    canActivate: [authGuard],
    title: "Stanowiska",
  },

  {
    path: "audit-logs",
    component: AuditLogComponent,
    canActivate: [authGuard],
    title: "Logi audytu",
  },

  {
    path: "",
    redirectTo: "/login",
    pathMatch: "full",
    title: "Logowanie do systemu",
  },
];
