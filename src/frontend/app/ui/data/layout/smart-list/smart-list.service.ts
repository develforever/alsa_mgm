import { inject, Injectable, signal } from "@angular/core";
import { ICrudService } from "../smart-list-layout.component";
import { NavigationExtras, Router } from "@angular/router";

@Injectable()
export class SmartListService<T extends Record<string, any> = Record<string, any>> {
    
    private router = inject(Router);
    private _dataService = signal<ICrudService<T> | undefined>(undefined);
    baseRoute = signal<string>('');

    getBaseRoute() {
        return this.baseRoute() || this.router.url.split('(')[0];
    }
    
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

    navigate(commands: any[], extras?: NavigationExtras) {
        this.router.navigate(commands, extras);
    }

    closeSidebar(commands: string | any[]) {
        const navCommands = Array.isArray(commands) ? commands : [commands];
        this.router.navigate(navCommands);
    }
}
