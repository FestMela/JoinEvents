import { Injectable, signal } from '@angular/core';

export interface ToastMessage {
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  id: number;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  toasts = signal<ToastMessage[]>([]);
  private counter = 0;

  show(message: string, type: ToastMessage['type'] = 'success', duration = 4000) {
    const id = this.counter++;
    const newToast: ToastMessage = { id, message, type };
    
    this.toasts.update(current => [...current, newToast]);

    setTimeout(() => {
      this.remove(id);
    }, duration);
  }

  success(message: string) { this.show(message, 'success'); }
  error(message: string) { this.show(message, 'error'); }
  info(message: string) { this.show(message, 'info'); }
  warning(message: string) { this.show(message, 'warning'); }

  remove(id: number) {
    this.toasts.update(current => current.filter(t => t.id !== id));
  }
}
