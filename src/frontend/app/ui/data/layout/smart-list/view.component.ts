import { Component, inject, OnInit, signal } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { SmartListService } from "./smart-list.service";

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
    private smartListService = inject(SmartListService);

    item = signal<any | undefined>(undefined);

    selectedProductId: number | null = null;

    ngOnInit() {

        this.route.params.subscribe(params => {
            const idFormUrl = params['id'];
            if (idFormUrl) {
                this.selectedProductId = Number(idFormUrl);
                this.smartListService.dataService.getOne(this.selectedProductId).subscribe((res) => {
                    this.item.set(res.data);
                });
            }
        });
    }

    closeSidebar() {
        this.smartListService.closeSidebar('/assembly/products');
    }

    editProduct() {
        this.smartListService.closeSidebar(['/assembly/products', { outlets: { sidebar: ['edit', this.selectedProductId] } }]);
    }

    deleteProduct() {
        if (this.selectedProductId) {
            this.smartListService.dataService.delete(this.selectedProductId).subscribe(() => {
                this.smartListService.refresh();
                this.closeSidebar();
            });
        }
    }

}