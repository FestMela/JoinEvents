import { Component, signal, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MockApiService } from '../../core/services/mock-api.service';
import { ServiceCategoryDef } from '../../core/models/service.model';

interface PlannerService { category: string; name: string; price: number; qty: number; }

@Component({ selector: 'app-event-planner', imports: [FormsModule], templateUrl: './event-planner.html', styleUrl: './event-planner.css' })
export class EventPlanner implements OnInit {
  private api = inject(MockApiService);
  categories = signal<ServiceCategoryDef[]>([]);
  selectedServices = signal<PlannerService[]>([]);
  eventDate = '';
  eventCity = '';
  guestCount = 100;
  eventName = '';
  saved = false;

  ngOnInit() { this.api.getServiceCategories().subscribe(c => this.categories.set(c)); }

  addService(cat: ServiceCategoryDef) {
    const exists = this.selectedServices().find(s => s.category === cat.id);
    if (!exists) {
      const prices: Record<string, number> = { venue: 50000, catering: 45000, decoration: 30000, transport: 15000, priest: 8000, manpower: 20000, photography: 25000, music: 18000 };
      this.selectedServices.update(s => [...s, { category: cat.id as string, name: cat.name, price: prices[cat.id] ?? 10000, qty: 1 }]);
    }
  }

  removeService(cat: string) { this.selectedServices.update(s => s.filter(x => x.category !== cat)); }
  isAdded(cat: string) { return this.selectedServices().some(s => s.category === cat); }
  getTotal() { return this.selectedServices().reduce((acc, s) => acc + s.price * s.qty, 0); }
  getGst() { return Math.round(this.getTotal() * 0.18); }
  getAdvance() { return Math.round(this.getTotal() * 0.2); }
  savePlan() { this.saved = true; setTimeout(() => this.saved = false, 3000); }
}
