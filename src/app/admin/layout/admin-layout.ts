import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { MockApiService } from '../../core/services/mock-api.service';
import { ThemeService } from '../../core/services/theme.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.css'
})
export class AdminLayout {
  private auth = inject(AuthService);
  private api = inject(MockApiService);
  public theme = inject(ThemeService);
  user = this.auth.currentUser;
  sidebarOpen = signal(false);
  showNotifications = signal(false);
  showProfileDropdown = signal(false);
  notifications = signal<any[]>([]);

  constructor() {
    this.api.getNotifications().subscribe(data => this.notifications.set(data));
  }

  get navItems() {
    const role = this.auth.getRole();
    const items = [
      { path: '/admin/dashboard',      icon: 'bi-speedometer2',    label: 'Dashboard' },
      { path: '/admin/bookings',       icon: 'bi-journal-text',    label: 'All Bookings' },
      { path: '/admin/customers',      icon: 'bi-people',          label: 'Customers' },
      { path: '/admin/vendors',        icon: 'bi-shop',            label: 'Vendors' },
      { path: '/admin/employees',      icon: 'bi-person-badge',    label: 'Employees', adminOnly: true },
    ].map(i => ({ ...i, badge: undefined as number | undefined }));
    return items.filter(item => !item.adminOnly || role === 'admin');
  }

  logout() { this.auth.logout(); }
  toggleSidebar() { this.sidebarOpen.update(v => !v); }
  toggleNotifications() { 
    this.showNotifications.update(v => !v); 
    if (this.showNotifications()) this.showProfileDropdown.set(false);
  }
  toggleProfileDropdown() { 
    this.showProfileDropdown.update(v => !v); 
    if (this.showProfileDropdown()) this.showNotifications.set(false);
  }
  getInitials(name: string) { return name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0,2) || 'A'; }

  handleImageError(event: Event) {
    const img = event.target as HTMLImageElement;
    img.style.display = 'none';
    if (img.nextElementSibling) {
      (img.nextElementSibling as HTMLElement).style.display = 'block';
    }
  }
}
