import { Component, inject, Input } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { FieldConfig } from "../../../../services/crud.service";
import { FilterableSelectComponent } from "../../../form/element/filterable-select/filterable-select.component";
import { SmartListService } from "./smart-list.service";

@Component({
    selector: 'app-smart-form-field',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatCheckboxModule,
        MatSlideToggleModule,
        FilterableSelectComponent
    ],
    template: `
        @if (type === 'checkbox') {
            <div class="mb-4">
                <mat-checkbox [formControl]="control" [attr.data-testid]="'input-' + key">
                    {{ label | titlecase }}
                </mat-checkbox>
            </div>
        } @else if (type === 'toggle') {
            <div class="mb-4">
                <mat-slide-toggle [formControl]="control" [attr.data-testid]="'input-' + key">
                    {{ label | titlecase }}
                </mat-slide-toggle>
            </div>
        } @else if (type === 'hidden') {
            <input [formControl]="control" type="hidden">
        } @else if (type === 'relation') {
            <div class="mb-4">
                <app-filterable-select 
                    [formControl]="control" 
                    [label]="config?.label || label" 
                    [fetchFn]="config?.fetchFn!"
                    [fetchByIdFn]="config?.fetchByIdFn" 
                    [displayKey]="config?.displayKey || 'Name'" 
                    [valueKey]="config?.valueKey || 'ID'">
                </app-filterable-select>
                @if (control.invalid && control.touched) {
                    <mat-error class="text-[75%] -mt-4 block mb-4">
                        {{ errorMessage }}
                    </mat-error>
                }
            </div>
        } @else {
            <mat-form-field class="w-full mb-4" appearance="outline">
                <mat-label>{{ label | titlecase }}</mat-label>
                <input matInput [formControl]="control" [type]="type"
                    [placeholder]="label" [attr.data-testid]="'input-' + key">

                @if (control.invalid && control.touched) {
                    <mat-error>{{ errorMessage }}</mat-error>
                }
            </mat-form-field>
        }
    `
})
export class SmartFormFieldComponent {
    @Input({ required: true }) control!: FormControl;
    @Input({ required: true }) key!: string;
    @Input() config?: FieldConfig;

    private smartListService = inject(SmartListService);

    get label(): string {
        return this.config?.label || this.key;
    }

    get type(): string {
        if (this.config) return this.config.type;
        if (this.key.toLowerCase().includes('id')) return 'hidden';
        if (typeof this.control.value === 'boolean') return 'checkbox';
        if (typeof this.control.value === 'number') return 'number';
        return 'text';
    }

    get errorMessage(): string {
        return this.smartListService.getErrorMessage(this.control.errors, this.config);
    }
}
