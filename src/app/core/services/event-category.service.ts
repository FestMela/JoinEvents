import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { EventType } from '../models/event.model';

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

@Injectable({ providedIn: 'root' })
export class EventCategoryService {
  private http = inject(HttpClient);

  /** Base URL for public event-category endpoints */
  private readonly base = `${environment.apiUrl}/event-categories`;

  getAll(): Observable<EventType[]> {
    return this.http
      .get<ApiResponse<any[]>>(this.base)
      .pipe(map(res => res.data.map(c => ({
        id: c.id,
        name: c.name,
        nameHindi: c.nameHindi,
        description: c.description,
        icon: c.icon,
        category: c.categoryKey as any,
        colorClass: c.colorClass,
        gradient: c.gradient,
        startingPrice: c.startingPrice,
        popularServices: c.popularServices
      }))));
  }
}
