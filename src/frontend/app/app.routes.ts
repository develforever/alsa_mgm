import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { LoginComponent } from './components/login/login.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { AllocationViewComponent } from './components/allocation-view/allocation-view.component';


export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    {
        path: 'products',
        component: ProductListComponent,
        canActivate: [authGuard]
    },
    {
        path: 'allocations',
        component: AllocationViewComponent,
        canActivate: [authGuard]
    },
    { path: '', redirectTo: '/allocations', pathMatch: 'full' }
];
