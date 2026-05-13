import { Injectable } from '@angular/core';
import { BaseApiService } from './base-api.service';
import { API_ROUTES } from '../constants/api.constants';
import { EventPackage, EventType } from '../models/event.model';
import { Observable, of } from 'rxjs';
import { catchError, map, delay } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class PackageService extends BaseApiService {

  getEventTypes(): Observable<EventType[]> {
    const fallback: EventType[] = [
      { id: 'wedding', name: 'Wedding', nameHindi: 'Shaadi', description: 'Grand Indian weddings with all rituals', icon: 'bi-hearts', category: 'wedding', colorClass: 'event-wedding', gradient: 'linear-gradient(135deg,#E91E8C,#FF6B6B)', startingPrice: 150000, popularServices: ['Venue', 'Catering', 'Decoration'] },
      { id: 'birthday', name: 'Birthday Party', nameHindi: 'Janmadin', description: 'Fun & vibrant birthday celebrations', icon: 'bi-balloon-heart', category: 'birthday', colorClass: 'event-birthday', gradient: 'linear-gradient(135deg,#FF6B35,#F59E0B)', startingPrice: 25000, popularServices: ['Venue', 'Catering', 'Decoration'] },
      { id: 'corporate', name: 'Corporate Event', nameHindi: 'Karobar', description: 'Professional corporate meets', icon: 'bi-briefcase', category: 'corporate', colorClass: 'event-corporate', gradient: 'linear-gradient(135deg,#0EA5E9,#6B21A8)', startingPrice: 80000, popularServices: ['Venue', 'Catering', 'Transport'] },
      { id: 'beauty-styling', name: 'Beauty & Styling', nameHindi: 'Saundarya', description: 'Bridal makeup, styling, and mehendi', icon: 'bi-stars', category: 'beauty', colorClass: 'event-beauty', gradient: 'linear-gradient(135deg,#D946EF,#8B5CF6)', startingPrice: 15000, popularServices: ['Makeup Artist', 'Mehendi Artist', 'Styling'] },
      { id: 'travel-transport', name: 'Travel & Transport', nameHindi: 'Yatra', description: 'Luxury cars, buses, and travel logistics', icon: 'bi-car-front-fill', category: 'travel', colorClass: 'event-travel', gradient: 'linear-gradient(135deg,#10B981,#3B82F6)', startingPrice: 10000, popularServices: ['Vintage Car', 'Transportation', 'Logistics'] },
      { id: 'event-shopping', name: 'Event Shopping', nameHindi: 'Kharidari', description: 'Wedding attire, jewelry, and return gifts', icon: 'bi-bag-heart-fill', category: 'shopping', colorClass: 'event-shopping', gradient: 'linear-gradient(135deg,#F43F5E,#F97316)', startingPrice: 50000, popularServices: ['Bridal Wear', 'Jewelry', 'Return Gifts'] },
    ];
    return of(fallback).pipe(delay(300));
  }

  getPackages(eventTypeId?: string): Observable<EventPackage[]> {
    const params: any = {};
    if (eventTypeId) params.eventTypeId = eventTypeId;

    return this.get<any[]>(API_ROUTES.PACKAGES.SEARCH, params).pipe(
      catchError(() => of([] as EventPackage[]))
    );
  }
}
