import { Component, signal, OnInit, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MockApiService } from '../../core/services/mock-api.service';
import { VendorService, ServiceCategoryDef } from '../../core/models/service.model';

@Component({
  selector: 'app-vendor-my-services',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './my-services.html',
  styleUrl: './my-services.css'
})
export class VendorMyServices implements OnInit {
  private api = inject(MockApiService);
  private router = inject(Router);
  
  services = signal<VendorService[]>([]);
  categories = signal<ServiceCategoryDef[]>([]);
  
  // Filter Signals
  filterStatus = signal<'all' | 'verified' | 'pending'>('all');
  searchQuery = signal<string>('');

  servicesStats = signal({
    total: 0,
    verified: 0,
    active: 0,
    reviews: 0
  });

  // Reactive Filtered List
  filteredServices = computed(() => {
    const list = this.services();
    const status = this.filterStatus();
    const query = this.searchQuery().toLowerCase();

    return list.filter(s => {
      const matchesStatus = status === 'all' || 
                           (status === 'verified' && s.isVerified) || 
                           (status === 'pending' && !s.isVerified);
      
      const matchesSearch = !query || 
                           s.name.toLowerCase().includes(query) || 
                           s.category.toLowerCase().includes(query) ||
                           s.city.toLowerCase().includes(query);

      return matchesStatus && matchesSearch;
    });
  });
  
  ngOnInit() {
    this.loadServices();
    this.api.getServiceCategories().subscribe(c => this.categories.set(c));
  }

  loadServices() {
    this.api.getVendorServices('v1').subscribe(s => {
      this.services.set(s);
      this.servicesStats.set({
        total: s.length,
        verified: s.filter(x => x.isVerified).length,
        active: s.filter(x => x.isActive).length,
        reviews: s.reduce((sum, x) => sum + x.totalReviews, 0)
      });
    });
  }

  editService(id: string) {
    this.router.navigate(['/vendor/edit-service', id]);
  }

  manageGallery(id: string) {
    // Navigate to photos step directly if we had a way, for now just navigate to edit
    this.router.navigate(['/vendor/edit-service', id]);
  }

  toggleServiceStatus(svc: VendorService) {
    svc.isActive = !svc.isActive;
    // Update stats
    this.servicesStats.update(s => ({
      ...s,
      active: this.services().filter(x => x.isActive).length
    }));
  }

  deleteService(id: string) {
    if (confirm('Are you sure you want to delete this service?')) {
      this.services.update(s => s.filter(x => x.id !== id));
    }
  }
}
