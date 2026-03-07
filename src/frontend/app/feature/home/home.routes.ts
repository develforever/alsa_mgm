import { Routes, CanActivateFn, RouterOutlet } from "@angular/router";
import { authGuard } from "../../guards/auth.guard";
import { LoginComponent } from "./components/login/login.component";
import { AuditLogComponent } from "./components/audit-log/audit-log.component";
import { Component, inject } from "@angular/core";
import { Router } from "@angular/router";
import { DashboardComponent } from "./components/dashboard/dashboard.component";


export const codeRedirectGuard: CanActivateFn = (route, state) => {
    const router = inject(Router);
    const code = route.queryParamMap.get('auth_code');

    if (code) {
        return router.createUrlTree(['/dashboard'], { queryParamsHandling: 'preserve' });
    } else {
        return router.createUrlTree(['/login'], { queryParamsHandling: 'preserve' });
    }
};

const routes: Routes = [

    {
        path: '',
        canActivate: [codeRedirectGuard],
        loadComponent: () => {
            @Component({
                standalone: true,
                template: `<router-outlet></router-outlet> `,
                imports: [RouterOutlet],
                styles: [`h1 { color: blue; }`]
            })
            class InlineComponent { }
            return InlineComponent;
        },
        data: {
            menuItems: [
                { label: 'Assembly', icon: 'precision_manufacturing', link: './assembly' },
            ]
        },
        children: [
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
    }
];

export function getRoute() {
    return {
        path: '',
        children: routes
    };
}
