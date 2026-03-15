import { Component, inject, OnInit, signal } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { DataProductService } from "../../../../services/data/product.service";
import { GetProductSchema } from "../../../../../../shared/api/product/schema";
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
    selector: 'app-product-list-sidebar',
    templateUrl: './product-list-sidebar.component.html',
    imports: [
        MatCardModule,
        MatButtonModule,
    ],
})
export class ProductListSidebarComponent implements OnInit {

    private route = inject(ActivatedRoute);
    private dataService = inject(DataProductService);

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

}