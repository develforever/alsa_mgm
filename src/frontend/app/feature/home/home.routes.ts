import { Route } from "@angular/router";
import { authGuard } from "../../guards/auth.guard";
import { LoginComponent } from "./components/login/login.component";
import { AuditLogComponent } from "./components/audit-log/audit-log.component";
import { HomeComponent } from "./components/home/home.component";
import { MainHomeComponent } from "./components/main.component";
import { codeRedirectGuard } from "../../guards/redirect.guard";
import { userManagementRoute } from "../admin/components/user-management/user-management.component";


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
                title: "Logowanie do systemu",
                canActivate: [codeRedirectGuard],
            },
            {
                path: "audit-logs",
                component: AuditLogComponent,
                canActivate: [authGuard],
                title: "Logi audytu",
            },
            userManagementRoute,
        ]
    };
}
