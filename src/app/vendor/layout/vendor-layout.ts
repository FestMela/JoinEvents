import { Component, signal, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { MockApiService } from '../../core/services/mock-api.service';
import { ThemeService } from '../../core/services/theme.service';

@Component({
  selector: 'app-vendor-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './vendor-layout.html',
  styleUrl: './vendor-layout.css'
})
export class VendorLayout {
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

  readonly navItems = [
    { path: '/vendor/dashboard',    icon: 'bi-grid-1x2',       label: 'Dashboard' },
    { path: '/vendor/network',      icon: 'bi-diagram-3',      label: 'B2B Network' },
    { path: '/vendor/impact',       icon: 'bi-globe-americas', label: 'ESG Impact' },
    { path: '/vendor/my-services',  icon: 'bi-box-seam',       label: 'Package List' },
    { path: '/vendor/add-service',  icon: 'bi-plus-circle',    label: 'Add Package' },
    { path: '/vendor/calendar',     icon: 'bi-calendar3',      label: 'Calendar' },
    { path: '/vendor/bookings',     icon: 'bi-journal-check',  label: 'Booking Requests', badge: 4 },
    { path: '/vendor/messages',     icon: 'bi-chat-dots',      label: 'Messages', badge: 1 },
    { path: '/vendor/rfp',          icon: 'bi-hammer',         label: 'RFP Board' },
    { path: '/vendor/finance',      icon: 'bi-wallet2',        label: 'Invoices & Banking' },
    { path: '/vendor/offers',       icon: 'bi-tags',           label: 'Promotional Offers' },
    { path: '/vendor/staff',        icon: 'bi-people',         label: 'Staff Management' },
    { path: '/vendor/verification', icon: 'bi-shield-check',   label: 'Verification' },
  ];

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
  getInitials(name: string) { return name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0,2) || 'V'; }

  handleImageError(event: Event) {
    const img = event.target as HTMLImageElement;
    img.style.display = 'none';
    if (img.nextElementSibling) {
      (img.nextElementSibling as HTMLElement).style.display = 'block';
    }
  }
}
