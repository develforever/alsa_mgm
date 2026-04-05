import { Route } from "@angular/router";
import { authGuard } from "../../guards/auth.guard";

export const getRoute = (): Route => {
  return {
    path: "production",
    loadComponent: () =>
      import("./components/production-plan-list/production-plan-list.component").then(
        (m) => m.ProductionPlanListComponent
      ),
    canActivate: [authGuard],
    title: "Plany produkcji",
    data: {
      requiresAuth: true,
      manuItem: {
        label: "Plany produkcji",
        icon: "calendar_month",
        link: "/production",
        menuItems: [],
      },
    },
    children: [
      {
        path: "",
        loadComponent: () =>
          import("./components/production-plan-list/production-plan-list.component").then(
            (m) => m.ProductionPlanListComponent
          ),
      },
      {
        path: "plans/new",
        loadComponent: () =>
          import("./components/production-plan-form/production-plan-form.component").then(
            (m) => m.ProductionPlanFormComponent
          ),
        title: "Nowy plan produkcji",
      },
      {
        path: "plans/:id",
        loadComponent: () =>
          import("./components/production-plan-form/production-plan-form.component").then(
            (m) => m.ProductionPlanFormComponent
          ),
        title: "Edycja planu produkcji",
      },
    ],
  };
};
