import { Component, signal, OnInit, inject, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { MockApiService } from '../../core/services/mock-api.service';
import { EventType } from '../../core/models/event.model';
import { Booking } from '../../core/models/booking.model';

@Component({
  selector: 'app-customer-dashboard',
  imports: [RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomerDashboard implements OnInit {
  private auth = inject(AuthService);
  private api = inject(MockApiService);

  user = this.auth.currentUser;
  eventTypes = signal<EventType[]>([]);
  bookings = signal<Booking[]>([]);

  readonly stats = [
    { label: 'Upcoming Events', value: '2', icon: 'bi-calendar-event', gradient: 'linear-gradient(135deg,#FF6B35,#F59E0B)', iconBg: 'rgba(255,107,53,0.12)', iconColor: 'var(--primary)' },
    { label: 'Active Bookings', value: '1', icon: 'bi-journal-check', gradient: 'linear-gradient(135deg,#6B21A8,#9333EA)', iconBg: 'rgba(107,33,168,0.12)', iconColor: 'var(--secondary)' },
    { label: 'Total Spent', value: '₹82.6K', icon: 'bi-currency-rupee', gradient: 'linear-gradient(135deg,#16A34A,#0EA5E9)', iconBg: 'rgba(22,163,74,0.12)', iconColor: 'var(--success)' },
    { label: 'Loyalty Points', value: '1,240', icon: 'bi-star-half', gradient: 'linear-gradient(135deg,#F59E0B,#FF6B35)', iconBg: 'rgba(245,158,11,0.12)', iconColor: 'var(--accent)' },
  ];

  ngOnInit() {
    this.api.getEventTypes().subscribe(t => this.eventTypes.set(t));
    this.api.getBookings('c1').subscribe(b => this.bookings.set(b));
  }

  getStatusBadgeClass(status: string): string {
    const map: Record<string, string> = { pending: 'ee-badge-warning', advance_paid: 'ee-badge-info', confirmed: 'ee-badge-secondary', in_progress: 'ee-badge-primary', completed: 'ee-badge-success', settled: 'ee-badge-success', cancelled: 'ee-badge-danger' };
    return map[status] || 'ee-badge-primary';
  }

  getStatusLabel(status: string): string {
    const map: Record<string, string> = { pending: 'Pending', advance_paid: 'Advance Paid', confirmed: 'Confirmed', in_progress: 'In Progress', completed: 'Completed', settled: 'Settled', cancelled: 'Cancelled' };
    return map[status] || status;
  }

  getGreeting(): string {
    const h = new Date().getHours();
    if (h < 12) return 'Good Morning';
    if (h < 17) return 'Good Afternoon';
    return 'Good Evening';
  }
}
