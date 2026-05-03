import { Component, signal, OnInit, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { MockApiService } from '../../core/services/mock-api.service';
import { ServiceCategoryDef } from '../../core/models/service.model';

@Component({
  selector: 'app-vendor-add-service',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-service.html',
  styleUrl: './add-service.css'
})
export class VendorAddService implements OnInit {
  private api = inject(MockApiService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  
  categories = signal<ServiceCategoryDef[]>([]);
  currentStep = signal(1);
  isSubmitting = signal(false);
  uploadedPhotos = signal<string[]>([]);
  isEditMode = signal(false);
  serviceId = signal<string | null>(null);

  // Form Data
  formData = {
    category: '',
    name: '',
    description: '',
    city: '',
    address: '',
    experience: '',
    
    // Pricing
    vegPrice: 0,
    nonVegPrice: 0,
    roomPrice: 0,
    basePrice: 0,
    rent: 0,
    unit: 'per event',

    // Capacity
    maxCapacity: 0,
    parkingCapacity: 0,
    totalRooms: 0,

    // Policies
    cateringPolicy: 'Inhouse Only',
    decorPolicy: 'Panel Decorators Only',
    alcoholPolicy: 'No Alcohol Allowed',
    djPolicy: 'Inhouse DJ Only',

    // Amenities
    hasAc: false,
    hasPowerBackup: false,
    hasChangingRooms: false,
    hasParking: false,

    // Spaces
    spaces: [
      { name: 'Main Hall', type: 'Indoor', seating: 0, floating: 0 }
    ],

    // Package Includes
    includes: [] as string[],

    // Package Theme
    theme: ''
  };

  newIncludeItem = signal('');

  availableInclusions = [
    'Venue', 'Catering', 'Anchor', 'Dhol', 'LED Wall', 'Dance Troupe', 
    'Live Music Band', 'Decoration', 'Pre Rituals Decoration', 'Entertainment', 
    'Photographer', 'DJ', 'Choreographer', 'Entry Theme', 'Makeup Artist', 
    'Mehndi Artist', 'Magician', 'Pandit Ji', 'Brass Band', 'Single Troup DJ', 
    'Vintage Car', 'Bagghi', 'Fireworks', 'Return Gifts', 'Event Planner', 
    'Transportation'
  ];

  availableThemes = [
    'Western Style / Christian Wedding',
    'Indian Traditional / Hindu Wedding',
    'Muslim / Nikah Wedding',
    'Spiritual Wedding',
    'Sikh / Anand Karaj Wedding',
    'Jain Wedding',
    'Buddhist Wedding'
  ];

  ngOnInit() {
    this.api.getServiceCategories().subscribe(c => this.categories.set(c));

    // Check for edit mode
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode.set(true);
      this.serviceId.set(id);
      this.loadServiceData(id);
    }
  }

  loadServiceData(id: string) {
    this.api.getVendorServices().subscribe(services => {
      const svc = services.find(s => s.id === id);
      if (svc) {
        // Hydrate form thoroughly
        this.formData.name = svc.name;
        this.formData.category = svc.category;
        this.formData.description = svc.description || '';
        this.formData.city = svc.city || '';
        
        // Map pricing based on category logic
        if (svc.category === 'venue') {
          this.formData.rent = svc.pricePerUnit;
        } else if (svc.category === 'catering') {
          this.formData.vegPrice = svc.pricePerUnit;
          this.formData.nonVegPrice = svc.pricePerUnit + 200; // Mock differential
        } else {
          this.formData.basePrice = svc.pricePerUnit;
        }

        // Hydrate photos
        if (svc.images && svc.images.length > 0) {
          this.uploadedPhotos.set(svc.images);
        } else {
          // Fallback images if mock data is empty
          this.uploadedPhotos.set([
            'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=800'
          ]);
        }
      }
    });
  }

  nextStep() {
    if (this.currentStep() < 4) {
      this.currentStep.update(s => s + 1);
      window.scrollTo(0, 0);
    }
  }

  prevStep() {
    if (this.currentStep() > 1) {
      this.currentStep.update(s => s - 1);
      window.scrollTo(0, 0);
    }
  }

  addSpace() {
    this.formData.spaces.push({ name: '', type: 'Indoor', seating: 0, floating: 0 });
  }

  removeSpace(index: number) {
    this.formData.spaces.splice(index, 1);
  }

  addInclude(item: string) {
    const val = item.trim();
    if (val && !this.formData.includes.includes(val)) {
      this.formData.includes.push(val);
    }
    // Reset dropdown if needed (not strictly necessary with the current UI)
  }

  removeInclude(index: number) {
    this.formData.includes.splice(index, 1);
  }

  triggerFileUpload() {
    // Mock photo upload
    const mockPhotos = [
      'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=400',
      'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=400',
      'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=400'
    ];
    if (this.uploadedPhotos().length < 6) {
      this.uploadedPhotos.update(p => [...p, mockPhotos[p.length % 3]]);
    }
  }

  removePhoto(index: number) {
    this.uploadedPhotos.update(p => p.filter((_, i) => i !== index));
  }

  saveService() {
    this.isSubmitting.set(true);
    // Mock save delay
    setTimeout(() => {
      this.isSubmitting.set(false);
      this.router.navigate(['/vendor/my-services']);
    }, 1500);
  }
}
