import { Component, signal, computed, OnInit, inject } from '@angular/core';
import { TitleCasePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MockApiService } from '../../core/services/mock-api.service';

interface VendorBookingReq { id: string; bookingId: string; customerName: string; eventDate: string; eventName: string; amount: number; status: string; review?: any; customerPhone?: string; }

@Component({ selector: 'app-vendor-bookings', imports: [TitleCasePipe, RouterLink], templateUrl: './vendor-bookings.html', styleUrl: './vendor-bookings.css' })
export class VendorBookings implements OnInit {
  private api = inject(MockApiService);
  requestsData = signal<VendorBookingReq[]>([]);
  filter = signal('all');

  requests = computed(() => {
    const globalRevs = this.api.globalReviews();
    return this.requestsData().map(req => {
      const rev = globalRevs.find(r => r.bookingId === req.bookingId && r.vendorId === 'v1');
      return { ...req, review: rev };
    });
  });

  ngOnInit() {
    this.api.getVendorDashboard('v1').subscribe(d => {
      const allReqs: VendorBookingReq[] = [...d.recentRequests, 
        { id: 'br3', bookingId: 'bk005', customerName: 'Anand Reddy', eventDate: '2026-07-15', eventName: 'Upanayanam Ceremony', amount: 35000, status: 'accepted' }, 
        { id: 'br4', bookingId: 'bk002', customerName: 'Rajesh Kumar', eventDate: '2025-11-20', eventName: "Daughter's Birthday", amount: 18000, status: 'completed' },
        { id: 'br5', bookingId: 'bk009', customerName: 'Anita Singh', eventDate: '2026-02-14', eventName: "Corporate Gala", amount: 50000, status: 'completed' }
      ];
      this.requestsData.set(allReqs);
    });
  }

  get filtered() { const f = this.filter(); return f === 'all' ? this.requests() : this.requests().filter(r => r.status === f); }

  selectedBookingId = signal<string | null>(null);

  toggleBookingDetails(id: string) {
    this.selectedBookingId.update(curr => curr === id ? null : id);
  }

  acceptRequest(id: string) { this.requestsData.update(rs => rs.map(r => r.id === id ? { ...r, status: 'accepted' } : r)); }
  declineRequest(id: string) { this.requestsData.update(rs => rs.map(r => r.id === id ? { ...r, status: 'declined' } : r)); }

  disputingReviewId = signal<string | null>(null);
  isSubmittingDispute = signal(false);

  submitDispute(reviewId: string, reason: string) {
    if (!reason.trim()) {
      alert('Please provide a reason for the dispute.');
      return;
    }
    this.isSubmittingDispute.set(true);
    this.api.flagReview(reviewId, reason).subscribe(() => {
      this.isSubmittingDispute.set(false);
      this.disputingReviewId.set(null);
    });
  }

  statusColor(s: string): string { const m: Record<string,string> = { pending:'ee-badge-warning', accepted:'ee-badge-success', declined:'ee-badge-danger', completed:'ee-badge-info' }; return m[s] || 'ee-badge-primary'; }
  statusLabel(s: string): string { const m: Record<string,string> = { pending:'Pending', accepted:'Accepted', declined:'Declined', completed:'Completed' }; return m[s] || s; }
}
