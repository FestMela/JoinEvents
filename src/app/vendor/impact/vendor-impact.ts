import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-vendor-impact',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './vendor-impact.html',
  styleUrl: './vendor-impact.css'
})
export class VendorImpact {
  
  impactData = signal({
    sustainabilityScore: 85,
    carbonOffsetKg: 1240,
    ecoBookings: 14,
    treesEquivalent: 56
  });

  recentEcoBookings = signal([
    { id: 'B-101', date: '2026-05-01', name: 'Sharma Wedding', impact: 'Zero Waste Catering', offset: '120 kg' },
    { id: 'B-094', date: '2026-04-18', name: 'Tech Corp Retreat', impact: 'Locally Sourced Menu', offset: '85 kg' },
    { id: 'B-082', date: '2026-03-22', name: 'Green Gala', impact: 'Compostable Setup', offset: '200 kg' }
  ]);

}
