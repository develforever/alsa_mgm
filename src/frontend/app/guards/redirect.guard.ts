import { CanActivateFn } from "@angular/router";
import { inject } from "@angular/core";
import { Router } from "@angular/router";
import { AppStoreService } from "../services/store.service";


export const codeRedirectGuard: CanActivateFn = (route, state) => {
    const router = inject(Router);
    const appStore = inject(AppStoreService);
    const code = route.queryParamMap.get('auth_code');

    if (appStore.code()) {
        return true;
    }

    if (code) {
        appStore.setCode(code);
        return router.createUrlTree(['/dashboard']);
    } else {
        if (state.url.includes('/login')) {
            return true;
        }
        return router.createUrlTree(['/login']);
    }
};