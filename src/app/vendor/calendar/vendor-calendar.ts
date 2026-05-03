import { Component, signal, OnInit, inject } from '@angular/core';
import { MockApiService } from '../../core/services/mock-api.service';
import { CalendarDay } from '../../core/models/vendor.model';

@Component({ selector: 'app-vendor-calendar', imports: [], templateUrl: './vendor-calendar.html', styleUrl: './vendor-calendar.css' })
export class VendorCalendar implements OnInit {
  private api = inject(MockApiService);
  days = signal<CalendarDay[]>([]);
  currentMonth = new Date().getMonth() + 1;
  currentYear = new Date().getFullYear();
  selectedDay = signal<CalendarDay | null>(null);
  readonly weekdays = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  readonly months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

  ngOnInit() { this.loadCalendar(); }
  loadCalendar() { this.api.getVendorCalendar('v1', this.currentMonth, this.currentYear).subscribe(d => this.days.set(d)); }

  prevMonth() { if (this.currentMonth === 1) { this.currentMonth = 12; this.currentYear--; } else { this.currentMonth--; } this.loadCalendar(); }
  nextMonth() { if (this.currentMonth === 12) { this.currentMonth = 1; this.currentYear++; } else { this.currentMonth++; } this.loadCalendar(); }

  getFirstDayOfWeek(): number { return new Date(this.currentYear, this.currentMonth - 1, 1).getDay(); }
  getMonthLabel(): string { return `${this.months[this.currentMonth - 1]} ${this.currentYear}`; }

  toggleDay(day: CalendarDay) {
    if (day.status === 'booked') return;
    const newStatus = day.status === 'available' ? 'blocked' : 'available';
    this.days.update(ds => ds.map(d => d.date === day.date ? { ...d, status: newStatus } : d));
    this.selectedDay.set({ ...day, status: newStatus });
  }

  getStatusColor(status: string): string {
    const map: Record<string, string> = { available: 'rgba(22,163,74,0.15)', booked: 'rgba(220,38,38,0.12)', blocked: 'rgba(148,163,184,0.25)', unavailable: 'rgba(0,0,0,0.05)' };
    return map[status] || '';
  }

  get stats() {
    const d = this.days();
    return { available: d.filter(x => x.status === 'available').length, booked: d.filter(x => x.status === 'booked').length, blocked: d.filter(x => x.status === 'blocked').length };
  }
}
