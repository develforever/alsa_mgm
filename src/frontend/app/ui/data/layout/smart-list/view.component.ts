import { Component, inject, OnInit, signal } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { GetProductSchema } from "../../../../../../shared/api/product/schema";
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
    selector: 'app-ui-data-layout-smart-list-view',
    templateUrl: './view.component.html',
    imports: [
        MatCardModule,
        MatButtonModule,
    ],
})
export class ViewComponent implements OnInit {

    private route = inject(ActivatedRoute);
    private dataService = inject(DataProductService);
    private router = inject(Router);

    product = signal<GetProductSchema | undefined>(undefined);

    selectedProductId: number | null = null;

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

    closeSidebar() {
        this.router.navigate(['/assembly/products']);
    }

    editProduct() {
        this.router.navigate(['/assembly/products', { outlets: { sidebar: ['edit', this.selectedProductId] } }]);
    }

    deleteProduct() {
        console.log('delete');
    }

}