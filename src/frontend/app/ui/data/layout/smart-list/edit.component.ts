import { Component, effect, inject, OnInit, signal } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { FormGroup, ReactiveFormsModule } from "@angular/forms";
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

    itemForm!: FormGroup;

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

    ngOnInit() {
        this.itemForm = this.smartListService.dataService.getFormGroup();

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
        this.smartListService.closeSidebar(this.smartListService.dataService.getListViewCommands());
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