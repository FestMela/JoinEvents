import { Component, OnInit, signal, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink, Router } from '@angular/router';
import { PackageService } from '../../core/services/package.service';
import { EventCategoryService } from '../../core/services/event-category.service';
import { Vendor } from '../../core/models/vendor.model';
import { EventType } from '../../core/models/event.model';

@Component({
  selector: 'app-customer-vendors',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './customer-vendors.html',
  styleUrl: './customer-vendors.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomerVendors implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private packageService = inject(PackageService);
  private eventCategoryService = inject(EventCategoryService);

  eventTypeId = signal<string | null>(null);
  eventType = signal<EventType | null>(null);
  allPackages = signal<any[]>([]);
  packages = signal<any[]>([]);
  loading = signal(true);

  // Filter signals
  filterLocation = signal('');
  filterDate = signal('');
  filterBudget = signal(10000000);
  filterPax = signal(0);
  filterFoodType = signal('all');
  filterEcoFriendly = signal(false);

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.eventTypeId.set(params['eventTypeId']);
      this.loadData();
    });
  }

  loadData() {
    this.loading.set(true);
    const routeId = this.eventTypeId();

    // Load live event type details from API instead of Mock
    this.eventCategoryService.getAll().subscribe(types => {
      // Match either by GUID Id OR by semantic category name (e.g. 'wedding')
      let type = types.find(t => t.id === routeId);
      if (!type && routeId) {
        type = types.find(t => t.category?.toLowerCase() === routeId.toLowerCase());
      }
      this.eventType.set(type || null);

      // Extract canonical category identifier, falling back directly to routeId if no match
      const categoryKey = type ? type.category : routeId;

      // Load packages by the category key to properly query real backend controller via PackageService
      this.packageService.getPackages(categoryKey as string).subscribe(p => {
        this.allPackages.set(p);
        this.applyFilters();
        this.loading.set(false);
      });
    });
  }

  applyFilters() {
    let filtered = this.allPackages();

    if (this.filterLocation()) {
      filtered = filtered.filter(p => p.location.toLowerCase().includes(this.filterLocation().toLowerCase()));
    }

    if (this.filterBudget()) {
      filtered = filtered.filter(p => p.price <= this.filterBudget());
    }

    if (this.filterPax()) {
      filtered = filtered.filter(p => p.maxGuests >= this.filterPax());
    }

    if (this.filterFoodType() !== 'all') {
      const isVeg = this.filterFoodType() === 'veg';
      filtered = filtered.filter(p => p.vegOnly === isVeg);
    }

    if (this.filterEcoFriendly()) {
      filtered = filtered.filter(p => p.sustainabilityTags && p.sustainabilityTags.length > 0);
    }

    this.packages.set(filtered);
  }

  updateFilter(key: string, value: any) {
    if (key === 'location') this.filterLocation.set(value);
    if (key === 'budget') this.filterBudget.set(Number(value));
    if (key === 'pax') this.filterPax.set(Number(value));
    if (key === 'foodType') this.filterFoodType.set(value);
    if (key === 'date') this.filterDate.set(value);
    if (key === 'eco') this.filterEcoFriendly.set(value);
    
    this.applyFilters();
  }

  selectVendor(packageId: string) {
    this.router.navigate(['/book', packageId]);
  }
}
