import { Component, inject, signal } from "@angular/core";
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { FormsModule } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { SmartListService } from "./smart-list.service";

@Component({
    selector: 'app-ui-data-layout-smart-list-add',
    templateUrl: './add.component.html',
    imports: [
        MatCardModule,
        MatButtonModule,
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
    ],
})
export class AddComponent {

    private smartListService = inject(SmartListService);

    newProductName = signal('');

    addProduct() {
        if (!this.newProductName().trim()) return;

        const productData = { Name: this.newProductName(), Active: 1 };
        this.smartListService.dataService.create(productData).subscribe(() => {
            this.newProductName.set('');
            this.smartListService.refresh();
            this.closeSidebar();
        });
    }

    closeSidebar() {
        this.smartListService.closeSidebar('/assembly/products');
    }
}