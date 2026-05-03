import { Component, signal, OnInit, inject } from '@angular/core';
import { TitleCasePipe } from '@angular/common';
import { MockApiService } from '../../core/services/mock-api.service';
import { Booking } from '../../core/models/booking.model';

@Component({ selector: 'app-admin-bookings', standalone: true, imports: [TitleCasePipe], templateUrl: './admin-bookings.html', styleUrl: './admin-bookings.css' })
export class AdminBookings implements OnInit {
  private api = inject(MockApiService);
  bookings = signal<Booking[]>([]);
  filter = signal('all');
  readonly statuses = ['all','pending','advance_paid','confirmed','in_progress','completed','settled','cancelled'];
  readonly statusColors: Record<string,string> = { pending:'ee-badge-warning', advance_paid:'ee-badge-info', confirmed:'ee-badge-secondary', in_progress:'ee-badge-primary', completed:'ee-badge-success', settled:'ee-badge-success', cancelled:'ee-badge-danger' };
  readonly statusLabels: Record<string,string> = { pending:'Pending', advance_paid:'Advance Paid', confirmed:'Confirmed', in_progress:'In Progress', completed:'Completed', settled:'Settled', cancelled:'Cancelled' };

  ngOnInit() { this.api.getAdminBookings().subscribe(b => this.bookings.set(b)); }
  get filtered() { const f = this.filter(); return f === 'all' ? this.bookings() : this.bookings().filter(b => b.status === f); }
}
