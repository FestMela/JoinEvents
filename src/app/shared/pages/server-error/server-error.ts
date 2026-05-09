import { Component, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-server-error',
  standalone: true,
  template: `
    <div class="error-page">
      <div class="error-content fade-in-up">
        <div class="error-icon-wrap">
          <i class="bi bi-exclamation-triangle"></i>
        </div>
        <h1 class="error-title">{{ errorTitle }}</h1>
        <p class="error-msg">{{ errorMessage }}</p>
        <div class="error-actions">
          <button class="btn-ee-primary" (click)="retry.emit()">
            <i class="bi bi-arrow-clockwise"></i> Try Again
          </button>
          <button class="btn-ee-outline" (click)="reload()">
            <i class="bi bi-arrow-repeat"></i> Reload Page
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .error-page {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--bg-app);
      padding: 24px;
    }
    .error-content { text-align: center; max-width: 480px; }
    .error-icon-wrap {
      width: 96px; height: 96px;
      border-radius: 28px;
      background: rgba(220, 38, 38, 0.1);
      display: flex; align-items: center; justify-content: center;
      font-size: 2.5rem;
      color: var(--danger);
      margin: 0 auto 24px;
      animation: float 3s ease-in-out infinite;
    }
    .error-title {
      font-family: var(--font-heading);
      font-size: clamp(1.5rem, 4vw, 2rem);
      font-weight: 800;
      color: var(--text-main);
      margin-bottom: 12px;
    }
    .error-msg {
      font-size: 1rem;
      color: var(--text-muted);
      line-height: 1.6;
      margin-bottom: 32px;
    }
    .error-actions {
      display: flex; gap: 12px;
      justify-content: center; flex-wrap: wrap;
    }
  `]
})
export class ServerErrorPage {
  @Input() errorTitle = 'Something Went Wrong';
  @Input() errorMessage = 'An unexpected error occurred. Our team has been notified. Please try again or refresh the page.';
  @Output() retry = new EventEmitter<void>();
  reload() { window.location.reload(); }
}
