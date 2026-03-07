


import { CommonModule } from "@angular/common";
import { Component, computed, inject } from "@angular/core";
import {
    RouterLink,
    RouterLinkActive,
    Router,
    ActivatedRoute,
    NavigationEnd,
} from "@angular/router";
import { filter, map } from "rxjs/operators";
import { toSignal } from "@angular/core/rxjs-interop";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from "../services/auth.service";

export interface MenuItem {
    label: string
    link?: string
    icon?: string
    requiresAuth?: boolean
    menuItems?: MenuItem[]
}

@Component({
    selector: "app-top-menu",
    host: {
        id: "app-top-menu",
        class: "app-top-menu",
    },
    imports: [
        CommonModule,
        RouterLink,
        RouterLinkActive,
        MatMenuModule,
        MatButtonModule,
        MatIconModule
    ],
    templateUrl: "./TopMenu.html",
})
export class AppTopMenu {

    protected router = inject(Router);
    private route = inject(ActivatedRoute);
    private authService = inject(AuthService);

    dynamicMenu = toSignal(
        this.router.events.pipe(
            filter(event => event instanceof NavigationEnd),
            map(() => {

                const fullMenu: MenuItem[] = [];
                let currentRoute = this.route.root;

                while (currentRoute) {

                    const items = currentRoute.snapshot.data['menuItems'];

                    const parentItems = currentRoute.parent?.snapshot.data['menuItems'];

                    if (items && Array.isArray(items) && items !== parentItems) {
                        fullMenu.push(...items);
                    }

                    currentRoute = currentRoute.firstChild!;
                }

                return fullMenu;
            })
        ),
        { initialValue: [] }
    );

    filteredMenu = computed(() => {
        const isLogged = this.authService.isLoggedIn();

        return this.dynamicMenu().filter(item => {
            if (!item.requiresAuth) return true;

            return isLogged;
        });
    });

}
