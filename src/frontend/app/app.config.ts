import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter, withRouterConfig } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { authInterceptor } from './interceptors/auth.interceptor';
import { apiErrorInterceptor } from './utils/api-error.interceptor';
import { CONTEXT_MENU_ROOT_PROVIDER } from './ui/context-menu/context-menu.providers';
import { provideAuditLogMenu } from './feature/home/components/audit-log/audit-log-menu.config';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideAnimationsAsync(),
    provideRouter(routes, withRouterConfig({ paramsInheritanceStrategy: 'always' })),
    provideHttpClient(withInterceptors([authInterceptor, apiErrorInterceptor])),
    CONTEXT_MENU_ROOT_PROVIDER,
    provideAuditLogMenu,
  ],
};
