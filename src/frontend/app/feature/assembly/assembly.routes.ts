import { RouterOutlet, Routes } from "@angular/router";
import { authGuard } from "../../guards/auth.guard";
import { ProductListComponent } from "./components/product-list/product-list.component";
import { AllocationViewComponent } from "./components/allocation-view/allocation-view.component";
import { LineListComponent } from "./components/line-list/line-list.component";
import { WorkstationListComponent } from "./components/workstation-list/workstation-list.component";
import { Component } from "@angular/core";

const routes: Routes = [
    {
        path: '',
        canActivate: [authGuard],
        loadComponent: () => {
            @Component({
                standalone: true,
                template: `
                    <router-outlet></router-outlet> 
                `,
                imports: [RouterOutlet],
                styles: [`h1 { color: blue; }`]
            })
            class InlineComponent { }
            return InlineComponent;
        },
        data: {
            menuItems: [
                { label: 'Produkty', icon: 'precision_manufacturing', link: '/assembly/products' },
                { label: 'Alokacje', icon: 'swap_horiz', link: '/assembly/allocations' },
                { label: 'Linie montażowe', icon: 'line_weight', link: '/assembly/lines' },
                { label: 'Stanowiska', icon: 'computer', link: '/assembly/workstations' }
            ]
        },
        children: [
            {
                path: "products",
                component: ProductListComponent,
                canActivate: [authGuard],
                title: "Produkty",
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
    }
];

export function getRoute() {
    return {
        path: 'assembly',
        children: routes
    };
}
