import { ApplicationConfig, ErrorHandler, provideBrowserGlobalErrorListeners, provideZoneChangeDetection, APP_INITIALIZER } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { cacheInterceptor } from './core/interceptors/cache.interceptor';
import { GlobalErrorHandler } from './core/handlers/global-error.handler';

export function checkBackendAvailability(errorHandler: ErrorHandler) {
  const globalHandler = errorHandler as GlobalErrorHandler;
  return () => {
    return fetch('https://localhost:7010/api/v1/auth/login', { method: 'OPTIONS' })
      .catch(error => {
        globalHandler.lastError.set({
          title: 'Backend Server Unavailable',
          message: 'The backend services are currently unreachable. Please make sure the API server is running and try again.'
        });
        globalHandler.hasFatalError.set(true);
      });
  };
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withInMemoryScrolling({ scrollPositionRestoration: 'top' })),
    provideHttpClient(withInterceptors([authInterceptor, cacheInterceptor])),
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
    {
      provide: APP_INITIALIZER,
      useFactory: checkBackendAvailability,
      deps: [ErrorHandler],
      multi: true
    }
  ]
};
