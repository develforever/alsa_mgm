import { Route } from "@angular/router";
import { authGuard } from "../../guards/auth.guard";
import { ProductionPlanListComponent } from "./components/production-plan-list/production-plan-list.component";
import { ProductionPlanFormComponent } from "./components/production-plan-form/production-plan-form.component";

export const getRoute = (): Route => {
  return {
    path: "production-plans",
    canActivate: [authGuard],
    title: "MENU.PRODUCTION_PLANS",
    data: {
      requiresAuth: true,
      manuItem: {
        label: "MENU.PRODUCTION_PLANS",
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
        title: "MENU.NEW_PRODUCTION_PLAN",
      },
      {
        path: ":id",
        component: ProductionPlanFormComponent,
        title: "MENU.EDIT_PRODUCTION_PLAN",
      },
    ],
  };
};
