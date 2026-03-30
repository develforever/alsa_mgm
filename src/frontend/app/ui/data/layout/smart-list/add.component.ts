import { Component, inject, OnInit } from "@angular/core";
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { SmartListService } from "./smart-list.service";
import { Crud_Form_Context, FieldConfig } from "../../../../services/crud.service";
import { SmartFormFieldComponent } from "./form-field.component";

@Component({
    selector: 'app-ui-data-layout-smart-list-add',
    templateUrl: './add.component.html',
    imports: [
        CommonModule,
        MatCardModule,
        MatButtonModule,
        ReactiveFormsModule,
        SmartFormFieldComponent
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

    fieldConfigs: Record<string, FieldConfig> = {};
    itemForm!: FormGroup;

    ngOnInit() {
        this.itemForm = this.smartListService.dataService.getFormGroup();
        if (this.smartListService.dataService.getFormConfig) {
            this.fieldConfigs = this.smartListService.dataService.getFormConfig(Crud_Form_Context.CREATE) || {};
        }
        this.itemForm.reset();
    }

    getControl(key: string): FormControl {
        return this.itemForm.get(key) as FormControl;
    }

    keepOrder = (): number => {
        return 0;
    }

    addItem() {
        if (this.itemForm.invalid) {
            this.smartListService.markAllAsTouched(this.itemForm);
            return;
        }

        let data = this.itemForm.value;
        if (this.smartListService.dataService.mapFormToModel) {
            data = this.smartListService.dataService.mapFormToModel(data);
        }

        this.smartListService.dataService.create(data).subscribe(() => {
            this.smartListService.refresh();
            this.closeSidebar();
        });
    }

    closeSidebar() {
        this.smartListService.closeSidebar(this.smartListService.getBaseRoute());
    }
}