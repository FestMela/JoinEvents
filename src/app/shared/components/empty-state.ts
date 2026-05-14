import { Component, Input, Output, EventEmitter } from '@angular/core';

/**
 * Universal empty-state placeholder.
 *
 * Usage:
 *   <app-empty-state
 *     icon="bi-inbox"
 *     title="No bookings yet"
 *     message="Browse events and create your first booking."
 *     actionLabel="Browse Events"
 *     (action)="router.navigate(['/events'])" />
 */
@Component({
  selector: 'app-empty-state',
  standalone: true,
  template: `
    <div class="empty-state">
      <div class="empty-state-icon">
        <i class="bi" [class]="icon"></i>
      </div>
      <h3 class="empty-state-title">{{ title }}</h3>
      <p  class="empty-state-msg">{{ message }}</p>
      @if (actionLabel) {
        <button class="btn-ee-primary empty-state-btn" (click)="action.emit()">
          <i class="bi bi-arrow-right"></i> {{ actionLabel }}
        </button>
      }
    </div>
  `,
  styles: [`
    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 60px 24px;
      min-height: 320px;
    }
    .empty-state-icon {
      width: 88px; height: 88px;
      border-radius: 24px;
      background: var(--bg-light);
      display: flex; align-items: center; justify-content: center;
      font-size: 2.2rem;
      color: var(--text-soft);
      margin-bottom: 24px;
      border: 1px solid var(--border-color);
    }
    .empty-state-title {
      font-family: var(--font-heading);
      font-size: var(--fs-xl, 1.5rem);
      font-weight: 800;
      color: var(--text-main);
      margin-bottom: 8px;
    }
    .empty-state-msg {
      font-size: var(--fs-sm, 0.875rem);
      color: var(--text-muted);
      max-width: 360px;
      line-height: 1.6;
      margin-bottom: 24px;
    }
    .empty-state-btn { margin-top: 4px; }
  `]
})
export class EmptyState {
  @Input() icon    = 'bi-inbox';
  @Input() title   = 'Nothing here yet';
  @Input() message = '';
  @Input() actionLabel = '';
  @Output() action = new EventEmitter<void>();
}
