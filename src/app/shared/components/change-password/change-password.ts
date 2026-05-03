import { Component, signal, inject, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './change-password.html',
  styleUrl: './change-password.css'
})
export class ChangePasswordComponent {
  private toast = inject(ToastService);
  
  @Output() close = new EventEmitter<void>();

  passwordData = {
    current: '',
    new: '',
    confirm: ''
  };

  showCurrent = signal(false);
  showNew = signal(false);
  showConfirm = signal(false);

  onSubmit() {
    if (this.passwordData.new !== this.passwordData.confirm) {
      this.toast.error('New passwords do not match');
      return;
    }
    
    if (this.passwordData.new.length < 6) {
      this.toast.error('Password must be at least 6 characters');
      return;
    }

    // Mock success
    setTimeout(() => {
      this.toast.success('Password changed successfully');
      this.close.emit();
    }, 1000);
  }
}
