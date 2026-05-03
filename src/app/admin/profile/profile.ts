import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { ChangePasswordComponent } from '../../shared/components/change-password/change-password';

@Component({
  selector: 'app-admin-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, ChangePasswordComponent],
  templateUrl: './profile.html'
})
export class AdminProfile {
  private auth = inject(AuthService);
  user = this.auth.currentUser;
  showPasswordModal = signal(false);

  profileData = {
    name: this.user()?.name || '',
    email: this.user()?.email || '',
    role: 'Senior Administrator',
    department: 'Platform Operations',
    lastLogin: '2026-04-21 10:30 AM'
  };

  isEditing = signal(false);

  saveProfile() {
    this.isEditing.set(false);
  }

  getInitials(name: string) {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  }
}
