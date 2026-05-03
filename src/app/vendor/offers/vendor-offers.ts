import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../../core/services/toast.service';

interface Offer {
  id: string;
  title: string;
  code: string;
  discount: number;
  type: 'percentage' | 'fixed';
  validUntil: string;
  status: 'active' | 'expired';
  description: string;
}

@Component({
  selector: 'app-vendor-offers',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './vendor-offers.html',
  styleUrl: './vendor-offers.css'
})
export class VendorOffers {
  private toast = inject(ToastService);

  offers = signal<Offer[]>([
    { id: '1', title: 'Summer Wedding Special', code: 'SUMMER25', discount: 25, type: 'percentage', validUntil: '2025-08-31', status: 'active', description: 'Applicable on all bookings above ₹1,00,000' },
    { id: '2', title: 'Early Bird Discount', code: 'EARLY5000', discount: 5000, type: 'fixed', validUntil: '2025-12-31', status: 'active', description: 'Flat ₹5000 off for bookings made 6 months in advance' },
    { id: '3', title: 'Monsoon Celebration', code: 'RAINY10', discount: 10, type: 'percentage', validUntil: '2024-07-15', status: 'expired', description: 'Exclusive rainy season discounts' }
  ]);

  showForm = signal(false);
  isEditing = signal(false);
  
  formData = {
    id: '',
    title: '',
    code: '',
    discount: 0,
    type: 'percentage' as 'percentage' | 'fixed',
    validUntil: '',
    description: ''
  };

  openAddForm() {
    this.isEditing.set(false);
    this.formData = { id: '', title: '', code: '', discount: 0, type: 'percentage', validUntil: '', description: '' };
    this.showForm.set(true);
  }

  editOffer(offer: Offer) {
    this.isEditing.set(true);
    this.formData = { ...offer };
    this.showForm.set(true);
  }

  saveOffer() {
    if (this.isEditing()) {
      this.offers.update(current => current.map(o => o.id === this.formData.id ? { ...this.formData, status: 'active' as const } : o));
      this.toast.success('Offer updated successfully!');
    } else {
      const newOffer: Offer = {
        ...this.formData,
        id: Math.random().toString(36).substr(2, 9),
        status: 'active'
      };
      this.offers.update(current => [newOffer, ...current]);
      this.toast.success('New offer created successfully!');
    }
    this.showForm.set(false);
  }

  toggleStatus(id: string) {
    this.offers.update(current => current.map(o => 
      o.id === id ? { ...o, status: o.status === 'active' ? 'expired' : 'active' } : o
    ));
    this.toast.info('Offer status updated');
  }

  deleteOffer(id: string) {
    if (confirm('Are you sure you want to delete this offer?')) {
      this.offers.update(current => current.filter(o => o.id !== id));
      this.toast.warning('Offer deleted');
    }
  }
}
