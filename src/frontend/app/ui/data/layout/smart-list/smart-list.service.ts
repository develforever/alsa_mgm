import { inject, Injectable, signal } from "@angular/core";
import { ICrudService } from "../smart-list-layout.component";
import { NavigationExtras, Router } from "@angular/router";
import { FormGroup, ValidationErrors } from "@angular/forms";
import { FieldConfig } from "../../../../services/crud.service";

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

    getErrorMessage(errors: ValidationErrors | null, config?: FieldConfig): string {
        if (!errors) return '';

        if (errors['required']) {
            return config?.validations?.['required'] || 'Pole jest wymagane';
        }
        if (errors['minlength']) {
            return config?.validations?.['minlength'] || `Minimalna długość to ${errors['minlength'].requiredLength} znaków`;
        }
        if (errors['maxlength']) {
            return config?.validations?.['maxlength'] || `Maksymalna długość to ${errors['maxlength'].requiredLength} znaków`;
        }
        if (errors['email']) {
            return config?.validations?.['email'] || 'Niepoprawny format adresu e-mail';
        }
        if (errors['pattern']) {
            return config?.validations?.['pattern'] || 'Niepoprawny format danych';
        }

        const firstErrorKey = Object.keys(errors)[0];
        return config?.validations?.[firstErrorKey] || 'Pole jest niepoprawne';
    }

    markAllAsTouched(form: FormGroup) {
        form.markAllAsTouched();
    }
}
