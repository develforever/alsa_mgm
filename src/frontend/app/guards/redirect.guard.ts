import { CanActivateFn } from "@angular/router";
import { inject } from "@angular/core";
import { Router } from "@angular/router";
import { AppStoreService } from "../services/store.service";
import { AuthService } from "../services/auth.service";
import { toObservable } from "@angular/core/rxjs-interop";
import { map, take } from "rxjs";


export const codeRedirectGuard: CanActivateFn = (route, state) => {
    const router = inject(Router);
    const appStore = inject(AppStoreService);
    const authService = inject(AuthService);
    const codeFromUrl = route.queryParamMap.get('auth_code');

    return toObservable(authService.isLoggedIn).pipe(
        map((isAuthenticated) => {
            if (isAuthenticated) {
                appStore.setUser(authService.user()!);
            }
            if (codeFromUrl) {
                appStore.setCode(codeFromUrl);
                return router.createUrlTree(['/dashboard']);
            }
            if (isAuthenticated || appStore.code()) {
                if (state.url.includes('/login')) {
                    return router.createUrlTree(['/dashboard']);
                }
                return true;
            }

            if (state.url.includes('/login')) {
                return true;
            }

            return router.createUrlTree(['/login']);
        }),
        take(1)
    );
};