import { Component, signal, OnInit, inject } from '@angular/core';
import { CommonModule, UpperCasePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { MockApiService } from '../../core/services/mock-api.service';
import { EventPackage } from '../../core/models/event.model';

@Component({
  selector: 'app-customer-packages',
  standalone: true,
  imports: [CommonModule, FormsModule, UpperCasePipe, RouterLink],
  templateUrl: './packages.html',
  styleUrl: './packages.css'
})
export class CustomerPackages implements OnInit {
  private api = inject(MockApiService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  packages = signal<EventPackage[]>([]);
  selectedEvent = signal('wedding');
  vendorId = signal<string | null>(null);
  filteredPackages = signal<EventPackage[]>([]);

  readonly eventOptions = [
    { id: 'wedding', label: '💍 Wedding' },
    { id: 'birthday', label: '🎂 Birthday' },
    { id: 'corporate', label: '💼 Corporate' },
    { id: 'religious', label: '🔥 Religious' },
  ];

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['eventTypeId']) this.selectedEvent.set(params['eventTypeId']);
      if (params['vendorId']) this.vendorId.set(params['vendorId']);
      
      this.api.getPackages().subscribe(p => {
        this.packages.set(p);
        this.filterPackages();
      });
    });
  }

  filterPackages() {
    this.filteredPackages.set(this.packages().filter(p => p.eventTypeId === this.selectedEvent()));
  }

  selectEvent(id: string) { this.selectedEvent.set(id); this.filterPackages(); }
  
  bookPackage(pkg: EventPackage) {
    this.router.navigate(['/customer/book', pkg.id]);
  }
  getTierGradient(tier: string) {
    return tier === 'basic' ? 'linear-gradient(135deg,#94A3B8,#64748B)' : tier === 'standard' ? 'var(--gradient-primary)' : 'var(--gradient-secondary)';
  }
  getTierLabel(tier: string) { return tier === 'basic' ? 'Silver' : tier === 'standard' ? 'Gold ⭐ Most Popular' : 'Diamond 💎 Premium'; }
}
