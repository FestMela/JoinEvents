import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { ChangePasswordComponent } from '../../shared/components/change-password/change-password';

@Component({
  selector: 'app-customer-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, ChangePasswordComponent],
  templateUrl: './profile.html'
})
export class CustomerProfile {
  private auth = inject(AuthService);
  user = this.auth.currentUser;
  showPasswordModal = signal(false);

  profileData = {
    name: this.user()?.name || '',
    email: this.user()?.email || '',
    phone: '+91 98765 43210',
    address: '123, Jubilee Hills, Hyderabad, Telangana',
    bio: 'Looking for the best event planners for my family functions.'
  };

  isEditing = signal(false);

  saveProfile() {
    // In a real app, call an API
    this.isEditing.set(false);
  }

  getInitials(name: string) {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  }
}
