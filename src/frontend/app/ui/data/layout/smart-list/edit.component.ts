import { Component, effect, inject, OnInit, signal } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { SmartListService } from "./smart-list.service";
import { Crud_Form_Context, FieldConfig } from "../../../../services/crud.service";
import { SmartFormFieldComponent } from "./form-field.component";

@Component({
    selector: 'app-ui-data-layout-smart-list-edit',
    templateUrl: './edit.component.html',
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
export class EditComponent implements OnInit {

    constructor() {
        effect(() => {
            const currentItem = this.item();
            if (currentItem) {
                let formValue = { ...currentItem };
                if (this.smartListService.dataService.mapModelToForm) {
                    formValue = this.smartListService.dataService.mapModelToForm(currentItem);
                }
                this.itemForm.patchValue(formValue as any, { emitEvent: false });
            }
        });
    }

    private route = inject(ActivatedRoute);
    private smartListService = inject(SmartListService);

    item = signal<any | undefined>(undefined);

    selectedId: string | number | null = null;
    fieldConfigs: Record<string, FieldConfig> = {};

    itemForm!: FormGroup;

    getControl(key: string): FormControl {
        return this.itemForm.get(key) as FormControl;
    }

    keepOrder = (): number => {
        return 0;
    }

    ngOnInit() {
        this.itemForm = this.smartListService.dataService.getFormGroup();
        if (this.smartListService.dataService.getFormConfig) {
            this.fieldConfigs = this.smartListService.dataService.getFormConfig(Crud_Form_Context.UPDATE) || {};
        }

        this.route.params.subscribe(params => {
            const idFormUrl = params['id'];
            if (idFormUrl) {
                this.selectedId = isNaN(Number(idFormUrl)) ? idFormUrl : Number(idFormUrl);
                if (this.selectedId !== null) {
                    this.smartListService.dataService.getOne(this.selectedId).subscribe((res) => {
                        this.item.set(res.data as any);
                    });
                }
            }
        });
    }

    onSubmit() {
        this.updateItem();
    }

    closeSidebar() {
        this.smartListService.closeSidebar(this.smartListService.getBaseRoute());
    }

    updateItem() {
        if (!this.selectedId) return;

        if (this.itemForm.invalid) {
            this.smartListService.markAllAsTouched(this.itemForm);
            return;
        }

        let update = this.itemForm.value;
        if (this.smartListService.dataService.mapFormToModel) {
            update = this.smartListService.dataService.mapFormToModel(update);
        }

        this.smartListService.dataService.update(this.selectedId, update).subscribe((res) => {
            this.item.set(res.data as any);
            this.smartListService.refresh();
        });
    }
}