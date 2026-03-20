import { inject, Injectable, signal } from "@angular/core";
import { ICrudService } from "../smart-list-layout.component";
import { Router } from "@angular/router";

@Injectable()
export class SmartListService<T extends Record<string, any> = Record<string, any>> {
    
    private router = inject(Router);
    private _dataService = signal<ICrudService<T> | undefined>(undefined);
    
    setDataService(service: ICrudService<T>) {
        this._dataService.set(service);
    }

    get dataService(): ICrudService<T> {
        const service = this._dataService();
        if (!service) {
            throw new Error('SmartListService: dataService not initialized');
        }
        return service;
    }

    refresh() {
        this.dataService.notifyChange();
    }

    closeSidebar(baseRoute: string) {
        this.router.navigate([baseRoute]);
    }
}
