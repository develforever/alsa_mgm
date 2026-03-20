import { Component, effect, inject, OnInit, signal } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { DataProductService } from "./service/product.service";
import { GetProductSchema, PatchProductsSchema } from "../../../../../../shared/api/product/schema";
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { CommonModule, KeyValue } from "@angular/common";


type ProductFormControls = {
    [K in keyof GetProductSchema]: FormControl<GetProductSchema[K] | null>;
};

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
            const currentProduct = this.product();
            if (currentProduct) {
                this.productForm.patchValue({
                    ...currentProduct,
                    Active: currentProduct.Active === 1
                } as any, { emitEvent: false });
            }
        });
    }

    private route = inject(ActivatedRoute);
    private dataService = inject(DataProductService);
    private router = inject(Router);

    product = signal<GetProductSchema | undefined>(undefined);

    selectedProductId: number | null = null;

    productForm = new FormGroup<ProductFormControls>({
        ProductID: new FormControl({ value: 0, disabled: true }, [Validators.required]),
        Name: new FormControl('', [Validators.required]),
        Active: new FormControl(0, Validators.required),
        CreatedAt: new FormControl({ value: new Date(), disabled: true }, [Validators.required]),
        UpdatedAt: new FormControl({ value: new Date(), disabled: true }, [Validators.required]),
    });

    getControlType(key: string): string {
        if (key === 'ProductID') return 'hidden';
        if (key === 'Active') return 'checkbox';
        const value = this.productForm.get(key)?.value;
        if (typeof value === 'number') return 'number';
        if (typeof value === 'boolean') return 'checkbox';
        return 'text';
    }

    keepOrder = (a: KeyValue<string, any>, b: KeyValue<string, any>): number => {
        return 0;
    }

    ngOnInit() {

        this.route.params.subscribe(params => {
            const idFormUrl = params['id'];
            if (idFormUrl) {
                this.selectedProductId = Number(idFormUrl);
                this.dataService.getProduct(this.selectedProductId).subscribe((res) => {
                    this.product.set(res.data);
                });
            }
        });
    }

    onSubmit() {
        console.log('submit');
    }

    closeSidebar() {
        this.router.navigate(['/assembly/products']);
    }

    updateProduct() {
        const update = {
            Name: this.productForm.value.Name,
            Active: this.productForm.value.Active ? 1 : 0,
        } as PatchProductsSchema;
        this.dataService.updateProduct(this.selectedProductId!, update).subscribe((res) => {
            this.product.set(res.data);
            this.dataService.notifyChange();
        });
    }


}