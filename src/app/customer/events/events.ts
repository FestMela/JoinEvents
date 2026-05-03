import { Component, signal, OnInit, inject, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MockApiService } from '../../core/services/mock-api.service';
import { EventType } from '../../core/models/event.model';

@Component({
  selector: 'app-customer-events',
  imports: [RouterLink, FormsModule],
  templateUrl: './events.html',
  styleUrl: './events.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomerEvents implements OnInit {
  private api = inject(MockApiService);
  events = signal<EventType[]>([]);
  filtered = signal<EventType[]>([]);
  search = '';
  selectedCategory = 'all';

  readonly categories = [
    { id: 'all', label: 'All Services' },
    { id: 'wedding', label: '💍 Weddings' },
    { id: 'birthday', label: '🎂 Birthdays' },
    { id: 'corporate', label: '💼 Corporate' },
    { id: 'beauty', label: '💄 Beauty' },
    { id: 'travel', label: '🚗 Travel' },
    { id: 'shopping', label: '🎁 Shopping' },
  ];

  ngOnInit() {
    this.api.getEventTypes().subscribe(e => { this.events.set(e); this.filtered.set(e); });
  }

  filterEvents() {
    let result = this.events();
    if (this.selectedCategory !== 'all') result = result.filter(e => e.category === this.selectedCategory);
    if (this.search.trim()) result = result.filter(e => e.name.toLowerCase().includes(this.search.toLowerCase()));
    this.filtered.set(result);
  }
}
