import { Route } from "@angular/router";
import { authGuard } from "../../guards/auth.guard";
import { ProductionPlanListComponent } from "./components/production-plan-list/production-plan-list.component";
import { ProductionPlanFormComponent } from "./components/production-plan-form/production-plan-form.component";

export const getRoute = (): Route => {
  return {
    path: "production-plans",
    canActivate: [authGuard],
    title: "Plany produkcji",
    data: {
      requiresAuth: true,
      manuItem: {
        label: "Plany produkcji",
        icon: "calendar_month",
        link: "/production-plans",
        menuItems: [],
      },
    },
    children: [
      {
        path: "",
        component: ProductionPlanListComponent,
      },
      {
        path: "new",
        component: ProductionPlanFormComponent,
        title: "Nowy plan produkcji",
      },
      {
        path: ":id",
        component: ProductionPlanFormComponent,
        title: "Edycja planu produkcji",
      },
    ],
  };
};
