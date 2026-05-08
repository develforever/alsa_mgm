import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter, withRouterConfig } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { isDevMode } from '@angular/core';
import { provideTransloco } from '@jsverse/transloco';
import { TranslocoHttpLoader } from './core/transloco-loader';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { PaginatorIntlService } from './core/paginator-intl.service';

import { routes } from './app.routes';
import { authInterceptor } from './interceptors/auth.interceptor';
import { apiErrorInterceptor } from './utils/api-error.interceptor';
import { provideAllContextMenuProviders } from './providers/all-context-menu.provider';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideAnimationsAsync(),
    provideRouter(routes, withRouterConfig({ paramsInheritanceStrategy: 'always' })),
    provideHttpClient(withInterceptors([authInterceptor, apiErrorInterceptor])),
    provideAllContextMenuProviders(),
    provideTransloco({
      config: {
        availableLangs: ['pl', 'en'],
        defaultLang: 'pl',
        reRenderOnLangChange: true,
        prodMode: !isDevMode(),
        fallbackLang: 'pl',
        missingHandler: {
          useFallbackTranslation: true,
          logMissingKey: false
        },
      },
      loader: TranslocoHttpLoader
    }),
    { provide: MatPaginatorIntl, useClass: PaginatorIntlService },
  ],
};
