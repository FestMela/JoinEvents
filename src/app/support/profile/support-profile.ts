import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { ChangePasswordComponent } from '../../shared/components/change-password/change-password';

@Component({
  selector: 'app-support-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, ChangePasswordComponent],
  templateUrl: './support-profile.html',
  styleUrl: './support-profile.css'
})
export class SupportProfile {
  private auth = inject(AuthService);
  user = this.auth.currentUser;
  showPasswordModal = signal(false);

  profileData = {
    name: this.user()?.name || '',
    email: this.user()?.email || '',
    role: 'Support Officer',
    department: 'Customer Satisfaction',
    employeeId: 'SUP-7729',
    shift: 'General (9 AM - 6 PM)',
    lastLogin: '2026-05-02 09:15 AM'
  };

  isEditing = signal(false);

  saveProfile() {
    this.isEditing.set(false);
  }

  getInitials(name: string) {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  }
}
