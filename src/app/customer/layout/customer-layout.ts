import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { MockApiService } from '../../core/services/mock-api.service';
import { ThemeService } from '../../core/services/theme.service';
import { AiPlanner } from '../ai-planner/ai-planner';

@Component({
  selector: 'app-customer-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, AiPlanner],
  templateUrl: './customer-layout.html',
  styleUrl: './customer-layout.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomerLayout {
  private auth = inject(AuthService);
  private router = inject(Router);
  private api = inject(MockApiService);
  public theme = inject(ThemeService);
  sidebarOpen = signal(false);
  showNotifications = signal(false);
  showProfileDropdown = signal(false);
  notifications = signal<any[]>([]);
  user = this.auth.currentUser;

  constructor() {
    this.api.getNotifications().subscribe(data => this.notifications.set(data));
  }

  readonly navItems = [
    { path: '/customer/dashboard', icon: 'bi-grid-1x2',      label: 'Dashboard' },
    { path: '/customer/events',    icon: 'bi-calendar-heart', label: 'Browse Events' },
    { path: '/customer/packages',  icon: 'bi-gift',           label: 'Packages' },
    { path: '/customer/planner',   icon: 'bi-pencil-square',  label: 'Event Planner', protected: true },
    { path: '/customer/rfp',       icon: 'bi-megaphone',      label: 'RFP Board', badge: 0, protected: true },
    { path: '/customer/bookings',  icon: 'bi-journal-check',  label: 'My Bookings', protected: true },
    { path: '/customer/messages',  icon: 'bi-chat-dots',      label: 'Messages', badge: 2, protected: true },
    { path: '/customer/payments',  icon: 'bi-credit-card',    label: 'Payments', protected: true },
  ];

  get filteredNavItems() {
    return this.navItems.filter(item => !item.protected || this.user());
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
  getInitials(name: string) { return name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0,2) || 'U'; }

  handleImageError(event: Event) {
    const img = event.target as HTMLImageElement;
    img.style.display = 'none';
    if (img.nextElementSibling) {
      (img.nextElementSibling as HTMLElement).style.display = 'block';
    }
  }
}
