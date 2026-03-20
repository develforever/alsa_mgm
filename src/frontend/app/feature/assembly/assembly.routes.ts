
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
        title: "Assembly Management",
        canActivate: [authGuard],
        component: MainAssemblyComponent,
        data: {
            manuItem: {
                label: 'Assembly',
                link: '/assembly',
                icon: 'precision_manufacturing',
                menuItems: [
                    { label: 'Dashboard', icon: 'dashboard', link: '/assembly' },
                    { label: 'Produkty', icon: 'precision_manufacturing', link: '/assembly/products' },
                    { label: 'Alokacje', icon: 'swap_horiz', link: '/assembly/allocations' },
                    { label: 'Linie montażowe', icon: 'line_weight', link: '/assembly/lines' },
                    { label: 'Stanowiska', icon: 'computer', link: '/assembly/workstations' }
                ]
            },
        },
        children: [
            {
                path: "products",
                component: ProductListComponent,
                canActivate: [authGuard],
                title: "Produkty",
                children: [...createSidebarRoutes()]
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
        ]
    };
}
