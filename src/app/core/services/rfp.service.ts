import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';
import { delay } from 'rxjs/operators';
import { EventRfp, RfpBid } from '../models/rfp.model';

@Injectable({ providedIn: 'root' })
export class RfpService {

  private rfps: EventRfp[] = [
    {
      id: 'rfp001',
      customerId: 'c1',
      customerName: 'Rajesh Kumar',
      title: 'Grand Wedding in Hyderabad — 400+ Guests',
      eventTypeId: 'wedding',
      eventTypeName: 'Wedding',
      eventDate: '2026-12-20',
      city: 'Hyderabad',
      guestCount: 450,
      budgetMin: 1500000,
      budgetMax: 2500000,
      requirements: 'Looking for a premium venue with in-house catering. Must have parking for 200+ cars. Prefer a banquet hall with outdoor lawn access. Full floral decoration and professional photography included.',
      servicesNeeded: ['Venue', 'Catering', 'Decoration', 'Photography', 'Music'],
      status: 'receiving_bids',
      createdAt: '2026-04-28T10:00:00',
      expiresAt: '2026-05-10T23:59:59',
      bids: [
        {
          id: 'bid001',
          rfpId: 'rfp001',
          vendorId: 'v1',
          vendorName: 'Amit Sharma',
          vendorBusinessName: 'Spice Garden Catering',
          vendorRating: 4.8,
          vendorReviews: 245,
          isVerified: true,
          proposedAmount: 1850000,
          description: 'We can offer a complete catering solution for 450 guests with a 5-course meal, live counters and staffing. Our team has handled over 50 weddings of this scale.',
          deliverables: ['5-Course Meal for 450', 'Live Grill Counter', '30 Service Staff', 'Post-event cleanup'],
          validUntil: '2026-05-15',
          submittedAt: '2026-04-29T09:30:00',
          status: 'pending'
        },
        {
          id: 'bid002',
          rfpId: 'rfp001',
          vendorId: 'v2',
          vendorName: 'Meera Krishnan',
          vendorBusinessName: 'Blooms & Bliss Decor',
          vendorRating: 4.9,
          vendorReviews: 312,
          isVerified: true,
          proposedAmount: 2100000,
          description: 'Full premium decor package including floral mandap, entrance arch, table centerpieces and photobooth setup. We use only fresh flowers and premium materials.',
          deliverables: ['Designer Floral Mandap', 'Welcome Entrance Arch', '50 Table Centerpieces', 'Photobooth Setup', 'Bridal Stage Lighting'],
          validUntil: '2026-05-12',
          submittedAt: '2026-04-29T14:00:00',
          status: 'pending'
        }
      ]
    },
    {
      id: 'rfp002',
      customerId: 'c1',
      customerName: 'Rajesh Kumar',
      title: 'Corporate Annual Day — 200 Employees',
      eventTypeId: 'corporate',
      eventTypeName: 'Corporate Event',
      eventDate: '2026-08-15',
      city: 'Hyderabad',
      guestCount: 200,
      budgetMin: 500000,
      budgetMax: 800000,
      requirements: 'Professional conference hall with AV equipment, team lunch and gala dinner. Need stage, backdrop and professional emcee. Indoor venue preferred.',
      servicesNeeded: ['Venue', 'Catering', 'Photography', 'Manpower'],
      status: 'open',
      createdAt: '2026-04-30T10:00:00',
      expiresAt: '2026-05-12T23:59:59',
      bids: []
    }
  ];

  getRfps(customerId: string): Observable<EventRfp[]> {
    return of(this.rfps.filter(r => r.customerId === customerId)).pipe(delay(400));
  }

  getAllOpenRfps(): Observable<EventRfp[]> {
    return of(this.rfps.filter(r => r.status === 'open' || r.status === 'receiving_bids')).pipe(delay(400));
  }

  getRfpById(id: string): Observable<EventRfp | undefined> {
    return of(this.rfps.find(r => r.id === id)).pipe(delay(300));
  }

  createRfp(rfp: Partial<EventRfp>): Observable<EventRfp> {
    const newRfp: EventRfp = {
      id: 'rfp' + Date.now(),
      customerId: rfp.customerId!,
      customerName: rfp.customerName!,
      title: rfp.title!,
      eventTypeId: rfp.eventTypeId!,
      eventTypeName: rfp.eventTypeName!,
      eventDate: rfp.eventDate!,
      city: rfp.city!,
      guestCount: rfp.guestCount!,
      budgetMin: rfp.budgetMin!,
      budgetMax: rfp.budgetMax!,
      requirements: rfp.requirements!,
      servicesNeeded: rfp.servicesNeeded || [],
      status: 'open',
      bids: [],
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    };
    this.rfps.unshift(newRfp);
    return of(newRfp).pipe(delay(500));
  }

  submitBid(rfpId: string, bid: Partial<RfpBid>): Observable<RfpBid> {
    const rfp = this.rfps.find(r => r.id === rfpId);
    if (rfp) {
      const newBid: RfpBid = {
        id: 'bid' + Date.now(),
        rfpId,
        vendorId: bid.vendorId!,
        vendorName: bid.vendorName!,
        vendorBusinessName: bid.vendorBusinessName!,
        vendorRating: bid.vendorRating || 0,
        vendorReviews: bid.vendorReviews || 0,
        isVerified: bid.isVerified || false,
        proposedAmount: bid.proposedAmount!,
        description: bid.description!,
        deliverables: bid.deliverables || [],
        validUntil: bid.validUntil!,
        submittedAt: new Date().toISOString(),
        status: 'pending'
      };
      rfp.bids.push(newBid);
      rfp.status = 'receiving_bids';
      return of(newBid).pipe(delay(500));
    }
    throw new Error('RFP not found');
  }

  acceptBid(rfpId: string, bidId: string): Observable<boolean> {
    const rfp = this.rfps.find(r => r.id === rfpId);
    if (rfp) {
      rfp.bids.forEach(b => b.status = b.id === bidId ? 'accepted' : 'rejected');
      rfp.status = 'bid_selected';
    }
    return of(true).pipe(delay(400));
  }
}
