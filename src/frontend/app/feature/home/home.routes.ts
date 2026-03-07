import { CanActivateFn, Route } from "@angular/router";
import { authGuard } from "../../guards/auth.guard";
import { LoginComponent } from "./components/login/login.component";
import { AuditLogComponent } from "./components/audit-log/audit-log.component";
import { inject } from "@angular/core";
import { Router } from "@angular/router";
import { DashboardComponent } from "./components/dashboard/dashboard.component";
import { HomeComponent } from "./components/home/home.component";
import { AppStoreService } from "../../services/store.service";
import { MainHomeComponent } from "./components/main.component";


export const codeRedirectGuard: CanActivateFn = (route, state) => {
    const router = inject(Router);
    const appStore = inject(AppStoreService);
    const code = route.queryParamMap.get('auth_code') ?? appStore.code();

    console.log(`${route.title} ${code}`);

    if (code) {
        appStore.setCode(code);
        //return router.createUrlTree(['/dashboard'], { queryParamsHandling: 'preserve' });
    } else {
        if (state.url.includes('/login')) {
            //    return true;
        }
        //return router.createUrlTree(['/login'], { queryParamsHandling: 'preserve' });
    }

    return true;
};


export function getRoute(): Route {
    return {
        path: '',
        canActivate: [codeRedirectGuard],
        component: MainHomeComponent,
        data: {
            menuItems: [

            ]
        },
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
