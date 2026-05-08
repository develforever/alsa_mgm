import { Component, inject, OnInit, signal } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { SmartListService } from "./smart-list.service";
import { CommonModule } from "@angular/common";
import { RouterLink } from "@angular/router";
import { TranslocoService, TranslocoModule } from '@jsverse/transloco';

@Component({
    selector: 'app-ui-data-layout-smart-list-view',
    templateUrl: './view.component.html',
    imports: [
        MatCardModule,
        MatButtonModule,
        CommonModule,
        RouterLink,
        TranslocoModule,
    ],
})
export class ViewComponent implements OnInit {

    private route = inject(ActivatedRoute);
    private smartListService = inject(SmartListService);
    private transloco = inject(TranslocoService);

    item = signal<Record<string, any> | undefined>(undefined);

    selectedId: number | null = null;

    keepOrder = (): number => {
        return 0;
    }

    formatValue(key: string, value: any): string {
        if (value === null || value === undefined) return '-';
        if (typeof value === 'boolean') return value ? this.transloco.translate('COMMON.YES') : this.transloco.translate('COMMON.NO');
        
        // Handle nested objects
        if (typeof value === 'object' && !Array.isArray(value)) {
            if (key === 'assemblyLine' && value.Name) {
                let result = value.Name;
                if (value.product && value.product.Name) {
                    result += ` (${value.product.Name})`;
                }
                return result;
            }
            if (key === 'workstation' && value.Name) {
                return `${value.ShortName || ''} - ${value.Name}`;
            }
            return JSON.stringify(value); // Fallback for other objects
        }
        
        const isDate = key.toLowerCase().endsWith('at') || key.toLowerCase().includes('date');
        if (isDate && typeof value === 'string' && !isNaN(Date.parse(value))) {
            return new Date(value).toLocaleString();
        }
        return String(value);
    }

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