import { Component, effect, inject, OnInit, signal } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { CommonModule } from "@angular/common";
import { SmartListService } from "./smart-list.service";

@Component({
    selector: 'app-ui-data-layout-smart-list-edit',
    templateUrl: './edit.component.html',
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
export class EditComponent implements OnInit {

    constructor() {
        effect(() => {
            const currentItem = this.item();
            if (currentItem) {
                this.itemForm.patchValue({
                    ...currentItem,
                    Active: (currentItem as any).Active === 1
                } as any, { emitEvent: false });
            }
        });
    }

    private route = inject(ActivatedRoute);
    private smartListService = inject(SmartListService);

    item = signal<any | undefined>(undefined);

    selectedId: string | number | null = null;

    // TODO: This form should be dynamically generated or passed via context
    itemForm = new FormGroup<Record<string, FormControl>>({
        ProductID: new FormControl({ value: 0, disabled: true }, [Validators.required]),
        Name: new FormControl('', [Validators.required]),
        Active: new FormControl(false, Validators.required),
        CreatedAt: new FormControl({ value: new Date(), disabled: true }, [Validators.required]),
        UpdatedAt: new FormControl({ value: new Date(), disabled: true }, [Validators.required]),
    });

    getControlType(key: string): string {
        if (key === 'ProductID') return 'hidden';
        if (key === 'Active') return 'checkbox';
        const value = this.itemForm.get(key)?.value;
        if (typeof value === 'number') return 'number';
        if (typeof value === 'boolean') return 'checkbox';
        return 'text';
    }

    keepOrder = (): number => {
        return 0;
    }

    ngOnInit() {
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
        this.smartListService.closeSidebar('/assembly/products');
    }

    updateItem() {
        if (!this.selectedId) return;

        const update = {
            ...this.itemForm.value,
            Active: this.itemForm.value['Active'] ? 1 : 0,
        };

        this.smartListService.dataService.update(this.selectedId, update).subscribe((res) => {
            this.item.set(res.data as any);
            this.smartListService.refresh();
        });
    }
}