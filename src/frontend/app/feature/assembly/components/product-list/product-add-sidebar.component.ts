import { Component, inject, signal } from "@angular/core";
import { DataProductService } from "../../../../services/data/product.service";
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { FormsModule } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { Router } from "@angular/router";

@Component({
    selector: 'app-product-add-sidebar',
    templateUrl: './product-add-sidebar.component.html',
    imports: [
        MatCardModule,
        MatButtonModule,
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
    ],
})
export class ProductAddSidebarComponent {


    private router = inject(Router);
    private dataService = inject(DataProductService);

    newProductName = signal('');

    addProduct() {
        if (!this.newProductName().trim()) return;

        const productData = { Name: this.newProductName(), Active: 1 };
        this.dataService.addProduct(productData).subscribe(() => {
            this.newProductName.set('');
            this.dataService.triggerRefresh();
            this.closeSidebar();
        });
    }

    closeSidebar() {
        this.router.navigate(['/assembly/products']);
    }
}