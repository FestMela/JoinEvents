import { Component, signal, OnInit, inject } from '@angular/core';
import { MockApiService } from '../../core/services/mock-api.service';
import { Booking } from '../../core/models/booking.model';

@Component({ selector: 'app-customer-payments', imports: [], templateUrl: './payments.html', styleUrl: './payments.css' })
export class CustomerPayments implements OnInit {
  private api = inject(MockApiService);
  bookings = signal<Booking[]>([]);
  selected = signal<Booking | null>(null);

  ngOnInit() { this.api.getBookings('c1').subscribe(b => { this.bookings.set(b); if (b.length) this.selected.set(b[0]); }); }

  select(b: Booking) { this.selected.set(b); }
  gst(b: Booking) { return Math.round((b.baseAmount + b.extraServicesAmount) * 0.18); }
  balance(b: Booking) { return b.totalAmount - b.advanceAmount; }
  readonly statusColors: Record<string, string> = { pending:'ee-badge-warning', advance_paid:'ee-badge-info', confirmed:'ee-badge-secondary', in_progress:'ee-badge-primary', completed:'ee-badge-success', settled:'ee-badge-success', cancelled:'ee-badge-danger' };
  readonly statusLabels: Record<string, string> = { pending:'Pending', advance_paid:'Advance Paid', confirmed:'Confirmed', in_progress:'In Progress', completed:'Completed', settled:'Settled', cancelled:'Cancelled' };
}
