import { Component, signal, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmService } from '../../components/confirm-dialog';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-notifications-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notifications.html',
  styleUrl: './notifications.css'
})
export class NotificationsPage implements OnInit {
  private confirmService = inject(ConfirmService);
  private auth = inject(AuthService);

  notifications = signal<any[]>([]);
  categories = signal<string[]>(['All']);
  activeFilter = signal('All');

  ngOnInit() {
    const role = this.auth.currentUser()?.role || 'customer';
    
    if (role === 'vendor') {
      this.categories.set(['All', 'Booking', 'Finance', 'Message', 'Feedback', 'Alert']);
      this.notifications.set([
        { id: 1, title: 'New Booking Request', message: 'You have received a new booking request for Grand Wedding Hall on June 12th.', time: '2 mins ago', icon: 'bi-calendar-check', color: '#FF6B35', category: 'Booking', isRead: false },
        { id: 2, title: 'Payment Success', message: 'Invoice #EE-9821 has been paid successfully by the customer.', time: '1 hour ago', icon: 'bi-cash-stack', color: '#10B981', category: 'Finance', isRead: false },
        { id: 3, title: 'New Enquiry', message: 'Anisha K. has sent an enquiry about your premium package.', time: '3 hours ago', icon: 'bi-chat-dots', color: '#3B82F6', category: 'Message', isRead: true },
        { id: 4, title: 'Service Review', message: 'Congratulations! You received a 5-star review from Mr. Gupta.', time: '1 day ago', icon: 'bi-star-fill', color: '#F59E0B', category: 'Feedback', isRead: true },
        { id: 5, title: 'Profile Verified', message: 'Your business profile has been successfully verified by our team.', time: '2 days ago', icon: 'bi-shield-check', color: '#6366F1', category: 'Alert', isRead: true }
      ]);
    } else if (role === 'admin') {
      this.categories.set(['All', 'User', 'System', 'Finance', 'Report']);
      this.notifications.set([
        { id: 1, title: 'New Vendor Registration', message: 'Vendor "Spice Garden" is pending approval.', time: '10 mins ago', icon: 'bi-shop', color: '#FF6B35', category: 'User', isRead: false },
        { id: 2, title: 'System Update', message: 'Platform scheduled maintenance will begin at 2 AM.', time: '2 hours ago', icon: 'bi-server', color: '#6366F1', category: 'System', isRead: true },
        { id: 3, title: 'Payout Processed', message: 'Weekly payouts to 15 vendors have been processed.', time: '5 hours ago', icon: 'bi-cash', color: '#10B981', category: 'Finance', isRead: true },
        { id: 4, title: 'User Report', message: 'A user reported an issue with the booking calendar.', time: '1 day ago', icon: 'bi-flag', color: '#EF4444', category: 'Report', isRead: true }
      ]);
    } else {
      // Customer
      this.categories.set(['All', 'Booking', 'Payment', 'Message', 'Promotion']);
      this.notifications.set([
        { id: 1, title: 'Booking Confirmed', message: 'Your booking for Daughter\'s Birthday has been confirmed by the vendor.', time: 'Just now', icon: 'bi-check-circle', color: '#10B981', category: 'Booking', isRead: false },
        { id: 2, title: 'Payment Reminder', message: 'Final payment for Invoice #EE-9821 is due next week.', time: '2 hours ago', icon: 'bi-credit-card', color: '#F59E0B', category: 'Payment', isRead: false },
        { id: 3, title: 'New Message', message: 'The decorator sent you a message regarding the theme.', time: '5 hours ago', icon: 'bi-chat-dots', color: '#3B82F6', category: 'Message', isRead: true },
        { id: 4, title: 'Special Offer', message: 'Get 20% off on your next venue booking!', time: '1 day ago', icon: 'bi-gift', color: '#EF4444', category: 'Promotion', isRead: true }
      ]);
    }
  }

  filteredNotifications = computed(() => {
    const currentFilter = this.activeFilter();
    if (currentFilter === 'All') {
      return this.notifications();
    }
    return this.notifications().filter(n => n.category === currentFilter);
  });

  markAllAsRead() {
    this.notifications.update(list => list.map(n => ({ ...n, isRead: true })));
  }

  deleteNotification(id: number) {
    this.notifications.update(list => list.filter(n => n.id !== id));
  }

  async clearAll() {
    const confirmed = await this.confirmService.ask({ 
      title: 'Clear Notifications',
      message: 'Are you sure you want to remove all notifications? This action cannot be undone.',
      confirmText: 'Clear All',
      type: 'danger'
    });

    if (confirmed) {
      this.notifications.set([]);
    }
  }
}
