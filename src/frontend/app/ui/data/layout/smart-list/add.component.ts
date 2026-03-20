import { Component, inject, OnInit } from "@angular/core";
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { FormGroup, ReactiveFormsModule } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { CommonModule } from "@angular/common";
import { SmartListService } from "./smart-list.service";

@Component({
    selector: 'app-ui-data-layout-smart-list-add',
    templateUrl: './add.component.html',
    imports: [
        CommonModule,
        MatCardModule,
        MatButtonModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatCheckboxModule
    ],
    styles: [`
        .full-width {
            width: 100%;
            margin-bottom: 1rem;
        }
    `]
})
export class AddComponent implements OnInit {

    private smartListService = inject(SmartListService);

    itemForm!: FormGroup;

    ngOnInit() {
        this.itemForm = this.smartListService.dataService.getFormGroup();
        // Clear any existing values to start fresh for "Add"
        this.itemForm.reset();
    }

    getControlType(key: string): string {
        if (key.toLowerCase().includes('id')) return 'hidden';
        const control = this.itemForm.get(key);
        if (typeof control?.value === 'boolean') return 'checkbox';
        if (typeof control?.value === 'number') return 'number';
        return 'text';
    }

    keepOrder = (): number => {
        return 0;
    }

    addItem() {
        if (this.itemForm.invalid) return;

        const data = {
            ...this.itemForm.value,
            // Convert boolean to numeric if service expects it
            Active: this.itemForm.value['Active'] ? 1 : 0,
        };

        this.smartListService.dataService.create(data).subscribe(() => {
            this.smartListService.refresh();
            this.closeSidebar();
        });
    }

    closeSidebar() {
        this.smartListService.closeSidebar(this.smartListService.getBaseRoute());
    }
}