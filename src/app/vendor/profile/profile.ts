import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { ChangePasswordComponent } from '../../shared/components/change-password/change-password';

@Component({
  selector: 'app-vendor-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, ChangePasswordComponent],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class VendorProfile {
  private auth = inject(AuthService);
  user = this.auth.currentUser;
  showPasswordModal = signal(false);

  profileData = {
    name: this.user()?.name || '',
    businessName: 'Spice Garden Catering',
    email: this.user()?.email || '',
    phone: '+91 91234 56789',
    city: 'Hyderabad',
    gst: '36AABCU9603R1ZX',
    description: 'Premier catering service specializing in authentic Indian cuisines.',
    // New section: Things to Know
    thingsToKnow: {
      workingSince: '2015',
      parkingCapacity: 50,
      vegPrice: 850,
      nonVegPrice: 1100,
      smallPartyVenue: 'Yes',
      space: 'Indoor & Outdoor',
      totalRooms: 12,
      avgRoomPrice: 4500,
      cateringPolicy: 'Inhouse only',
      decorPolicy: 'Both allowed',
      alcoholPolicy: 'Allowed',
      djPolicy: 'Inhouse only',
      maxCapacity: 500,
      starRating: '4 Star',
      buyoutPrice: 75000
    },
    customFacts: [
      { id: 1, label: 'Outside Alcohol', value: 'Allowed with corkage' },
      { id: 2, label: 'Late Night Events', value: 'Till 2 AM' }
    ]
  };

  newFact = { label: '', value: '' };

  addFact() {
    if (this.newFact.label && this.newFact.value) {
      this.profileData.customFacts.push({ 
        id: Date.now(), 
        ...this.newFact 
      });
      this.newFact = { label: '', value: '' };
    }
  }

  removeFact(id: number) {
    this.profileData.customFacts = this.profileData.customFacts.filter(f => f.id !== id);
  }

  isEditing = signal(false);

  saveProfile() {
    this.isEditing.set(false);
  }

  getInitials(name: string) {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  }
}
