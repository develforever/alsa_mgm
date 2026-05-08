
import { authGuard } from "../../guards/auth.guard";
import { ProductListComponent } from "./components/product-list/product-list.component";
import { AllocationViewComponent } from "./components/allocation-view/allocation-view.component";
import { LineListComponent } from "./components/line-list/line-list.component";
import { WorkstationListComponent } from "./components/workstation-list/workstation-list.component";
import { MainAssemblyComponent } from "./main.component";
import { Route } from "@angular/router";
import { createSidebarRoutes } from "../../ui/data/layout/smart-list/routes";

export function getRoute(): Route {
    return {
        path: 'assembly',
        title: "MENU.ASSEMBLY_MANAGEMENT",
        canActivate: [authGuard],
        component: MainAssemblyComponent,
        data: {
            manuItem: {
                label: 'MENU.ASSEMBLY',
                link: '/assembly',
                icon: 'precision_manufacturing',
                menuItems: [
                    { label: 'MENU.DASHBOARD', icon: 'dashboard', link: '/assembly' },
                    { label: 'MENU.PRODUCTS', icon: 'precision_manufacturing', link: '/assembly/products' },
                    { label: 'MENU.ALLOCATIONS', icon: 'swap_horiz', link: '/assembly/allocations' },
                    { label: 'MENU.LINES', icon: 'line_weight', link: '/assembly/lines' },
                    { label: 'MENU.WORKSTATIONS', icon: 'computer', link: '/assembly/workstations' }
                ]
            },
        },
        children: [
            {
                path: "products",
                component: ProductListComponent,
                canActivate: [authGuard],
                title: "MENU.PRODUCTS",
                children: [...createSidebarRoutes()]
            },
            {
                path: "allocations",
                component: AllocationViewComponent,
                canActivate: [authGuard],
                title: "MENU.ALLOCATIONS",
                children: [...createSidebarRoutes()]
            },
            {
                path: "lines",
                component: LineListComponent,
                canActivate: [authGuard],
                title: "MENU.LINES",
                children: [...createSidebarRoutes()]
            },
            {
                path: "workstations",
                component: WorkstationListComponent,
                canActivate: [authGuard],
                title: "MENU.WORKSTATIONS",
                children: [...createSidebarRoutes()]
            },
        ]
    };
}
