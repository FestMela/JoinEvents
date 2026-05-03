import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-global-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container">
      @for (toast of toastService.toasts(); track toast.id) {
        <div class="toast-item slide-in" [class]="toast.type">
          <div class="toast-icon">
            @if (toast.type === 'success') { <i class="bi bi-check-circle-fill"></i> }
            @if (toast.type === 'error') { <i class="bi bi-x-circle-fill"></i> }
            @if (toast.type === 'info') { <i class="bi bi-info-circle-fill"></i> }
            @if (toast.type === 'warning') { <i class="bi bi-exclamation-triangle-fill"></i> }
          </div>
          <div class="toast-content">{{ toast.message }}</div>
          <button class="toast-close" (click)="toastService.remove(toast.id)">
            <i class="bi bi-x"></i>
          </button>
        </div>
      }
    </div>
  `,
  styles: [`
    .toast-container {
      position: fixed;
      top: 30px;
      right: 30px;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 12px;
      pointer-events: none;
    }
    .toast-item {
      pointer-events: auto;
      min-width: 320px;
      background: var(--bg-card);
      backdrop-filter: blur(10px);
      border: 1px solid var(--border-color);
      border-radius: 20px;
      padding: 16px 20px;
      display: flex;
      align-items: center;
      gap: 16px;
      box-shadow: 0 20px 40px rgba(0,0,0,0.15);
      overflow: hidden;
      position: relative;
    }
    .toast-item::after {
      content: '';
      position: absolute;
      bottom: 0; left: 0;
      width: 100%; height: 4px;
      background: var(--primary);
      opacity: 0.2;
    }
    .toast-icon {
      font-size: 1.5rem;
      display: flex; align-items: center; justify-content: center;
    }
    .success .toast-icon { color: #10b981; }
    .error .toast-icon { color: #ef4444; }
    .info .toast-icon { color: #3b82f6; }
    .warning .toast-icon { color: #f59e0b; }
    
    .success { border-left: 5px solid #10b981; }
    .error { border-left: 5px solid #ef4444; }
    .info { border-left: 5px solid #3b82f6; }
    .warning { border-left: 5px solid #f59e0b; }

    .toast-content {
      flex: 1;
      font-weight: 700;
      color: var(--text-main);
      font-size: 0.95rem;
    }
    .toast-close {
      background: transparent;
      border: none;
      color: var(--text-soft);
      cursor: pointer;
      font-size: 1.2rem;
      padding: 4px;
      transition: color 0.2s;
    }
    .toast-close:hover { color: var(--danger); }

    .slide-in {
      animation: slideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
    @keyframes slideIn {
      from { opacity: 0; transform: translateX(50px) scale(0.9); }
      to { opacity: 1; transform: translateX(0) scale(1); }
    }
  `]
})
export class GlobalToast {
  toastService = inject(ToastService);
}
