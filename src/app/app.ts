import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GlobalToast } from './shared/components/global-toast';
import { GlobalConfirmComponent } from './shared/components/confirm-dialog';
import { ServerErrorPage } from './shared/pages/server-error/server-error';
import { GlobalErrorHandler } from './core/handlers/global-error.handler';
import { ErrorHandler } from '@angular/core';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, GlobalToast, GlobalConfirmComponent, ServerErrorPage],
  template: `
    @if (errorHandler.hasFatalError()) {
      <app-server-error (retry)="errorHandler.clearError()" />
    } @else {
      <router-outlet />
    }
    <app-global-toast />
    <app-global-confirm />
  `,
  styles: []
})
export class App {
  /**
   * Error boundary: when the GlobalErrorHandler catches an unrecoverable
   * exception it flips hasFatalError → true, and this template swaps the
   * router-outlet for the ServerErrorPage fallback.
   */
  readonly errorHandler = inject(ErrorHandler) as GlobalErrorHandler;
}
