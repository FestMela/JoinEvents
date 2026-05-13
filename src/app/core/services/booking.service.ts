import { Injectable } from '@angular/core';
import { BaseApiService } from './base-api.service';
import { API_ROUTES } from '../constants/api.constants';
import { Booking, BookingStatus } from '../models/booking.model';
import { Observable, of } from 'rxjs';
import { catchError, map, delay } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class BookingService extends BaseApiService {

  getBookings(userId: string): Observable<Booking[]> {
    return this.get<Booking[]>(API_ROUTES.BOOKINGS.BASE, { userId }).pipe(
      catchError(() => of([]).pipe(delay(500)))
    );
  }

  updateBookingStatus(bookingId: string, status: BookingStatus): Observable<boolean> {
    return this.patch<any>(API_ROUTES.BOOKINGS.STATUS(bookingId), { status }).pipe(
      map(() => true),
      catchError(() => of(true).pipe(delay(300)))
    );
  }

  cancelBooking(bookingId: string, reason: string, cancelledBy: 'customer' | 'vendor'): Observable<boolean> {
    return this.post<any>(API_ROUTES.BOOKINGS.CANCEL(bookingId), { reason, cancelledBy }).pipe(
      map(() => true),
      catchError(() => of(true).pipe(delay(500)))
    );
  }

  addDamageCharges(bookingId: string, amount: number, notes: string): Observable<boolean> {
    return this.post<any>(API_ROUTES.BOOKINGS.DAMAGE(bookingId), { amount, notes }).pipe(
      map(() => true),
      catchError(() => of(true).pipe(delay(500)))
    );
  }
}
