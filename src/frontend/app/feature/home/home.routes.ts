import { Route } from "@angular/router";
import { authGuard } from "../../guards/auth.guard";
import { LoginComponent } from "./components/login/login.component";
import { AuditLogComponent } from "./components/audit-log/audit-log.component";
import { DashboardComponent } from "./components/dashboard/dashboard.component";
import { HomeComponent } from "./components/home/home.component";
import { MainHomeComponent } from "./components/main.component";
import { codeRedirectGuard } from "../../guards/redirect.guard";


export function getRoute(): Route {
    return {
        path: '',
        canActivate: [codeRedirectGuard],
        component: MainHomeComponent,
        children: [
            {
                path: '',
                component: HomeComponent,
            },
            {
                path: "login",
                component: LoginComponent,
                title: "Logowanie do systemu"
            },
            {
                path: "audit-logs",
                component: AuditLogComponent,
                canActivate: [authGuard],
                title: "Logi audytu",
            },
            {
                path: "dashboard",
                canActivate: [authGuard],
                pathMatch: "full",
                title: "Dashboard",
                component: DashboardComponent,
            },
        ]
    };
}
