import { Injectable, inject } from '@angular/core';
import { MockApiService } from './mock-api.service';
import { Observable } from 'rxjs';
import { delay, map } from 'rxjs/operators';

export interface AdminAnalyticsData {
  totalRevenue: number;
  monthlyRevenue: number[];
  bookingCountByStatus: Record<string, number>;
  top5VendorsByEarnings: any[];
  customerAcquisitionByMonth: number[];
  averageBookingValue: number;
}

export interface VendorAnalyticsData {
  totalEarnings: number;
  monthlyEarnings: number[];
  bookingCountByStatus: Record<string, number>;
  averageRatingTrend: number[];
  topPerformingService: any;
}

@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  private api = inject(MockApiService);

  getAdminAnalytics(): Observable<AdminAnalyticsData> {
    return this.api.getAdminBookings().pipe(
      map(bookings => {
        let totalRevenue = 0;
        const monthlyRevenue = Array(12).fill(0);
        const bookingCountByStatus: Record<string, number> = {
          pending: 0,
          advance_paid: 0,
          confirmed: 0,
          in_progress: 0,
          completed: 0,
          settled: 0,
          cancelled: 0
        };
        const customerAcquisitionByMonth = [15, 20, 24, 18, 30, 35, 28, 45, 40, 52, 60, 75];

        bookings.forEach(b => {
          totalRevenue += b.totalAmount;
          bookingCountByStatus[b.status] = (bookingCountByStatus[b.status] || 0) + 1;
          
          if (b.eventDate) {
            const parts = b.eventDate.split('-');
            const month = parseInt(parts[1], 10) - 1;
            if (month >= 0 && month < 12) {
              monthlyRevenue[month] += b.totalAmount;
            }
          }
        });

        const top5VendorsByEarnings = [
          { vendorId: 'v1', vendorName: 'Spice Garden Catering', totalEarnings: 450000, category: 'Catering' },
          { vendorId: 'v2', vendorName: 'Blooms & Bliss Decor', totalEarnings: 320000, category: 'Decoration' },
          { vendorId: 'v3', vendorName: 'Grand Hyatt Lawn', totalEarnings: 280000, category: 'Venue' },
          { vendorId: 'v4', vendorName: 'Pixel Perfect Photography', totalEarnings: 150000, category: 'Photography' },
          { vendorId: 'v5', vendorName: 'DJ Spark', totalEarnings: 90000, category: 'Music' }
        ];

        const averageBookingValue = bookings.length ? totalRevenue / bookings.length : 0;

        return {
          totalRevenue,
          monthlyRevenue,
          bookingCountByStatus,
          top5VendorsByEarnings,
          customerAcquisitionByMonth,
          averageBookingValue
        };
      }),
      delay(300)
    );
  }

  getVendorAnalytics(vendorId: string): Observable<VendorAnalyticsData> {
    return this.api.getVendorServices(vendorId).pipe(
      map(services => {
        const totalEarnings = 850000;
        const monthlyEarnings = [40000, 50000, 65000, 45000, 80000, 95000, 70000, 110000, 85000, 120000, 150000, 180000];
        const bookingCountByStatus = {
          pending: 4,
          accepted: 3,
          declined: 1,
          completed: 87
        };
        const averageRatingTrend = [4.5, 4.6, 4.6, 4.7, 4.7, 4.8, 4.8, 4.8, 4.9, 4.8, 4.9, 4.8];
        const topPerformingService = services.length ? services[0] : null;

        return {
          totalEarnings,
          monthlyEarnings,
          bookingCountByStatus,
          averageRatingTrend,
          topPerformingService
        };
      }),
      delay(300)
    );
  }
}
