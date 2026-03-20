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

    selectedId: number | null = null;

    ngOnInit() {

        this.route.params.subscribe(params => {
            const idFormUrl = params['id'];
            if (idFormUrl) {
                this.selectedId = Number(idFormUrl);
                this.smartListService.dataService.getOne(this.selectedId).subscribe((res) => {
                    this.item.set(res.data);
                });
            }
        });
    }

    closeSidebar() {
        this.smartListService.closeSidebar(this.smartListService.getBaseRoute());
    }

    editItem() {
        if (this.selectedId) {
            const baseRoute = this.smartListService.getBaseRoute();
            const sidebarRoute = this.smartListService.dataService.getItemEditRoute(this.selectedId);
            this.smartListService.closeSidebar([baseRoute, { outlets: { sidebar: sidebarRoute } }]);
        }
    }

    deleteItem() {
        if (this.selectedId) {
            this.smartListService.dataService.delete(this.selectedId).subscribe(() => {
                this.smartListService.refresh();
                this.closeSidebar();
            });
        }
    }

}