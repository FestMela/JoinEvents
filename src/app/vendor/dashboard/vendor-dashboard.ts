import { Component, signal, OnInit, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MockApiService } from '../../core/services/mock-api.service';
import { ToastService } from '../../core/services/toast.service';

@Component({ 
  selector: 'app-vendor-dashboard', 
  standalone: true,
  imports: [CommonModule, RouterLink], 
  templateUrl: './vendor-dashboard.html', 
  styleUrl: './vendor-dashboard.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VendorDashboard implements OnInit {
  private api = inject(MockApiService);
  private toast = inject(ToastService);
  dashboard = signal<any>(null);
  vendorProfile = signal<any>(null);
  shareProfileLink = signal('https://joinevents.com/v/spice-garden-catering');
  
  // New Feature Signals
  recentEnquiries = signal([
    { id: 'enq1', customer: 'Anjali Sharma', service: 'Banquet Hall', time: '10 mins ago', msg: 'Is it available for 15th Dec?' },
    { id: 'enq2', customer: 'Karan Malhotra', service: 'Catering', time: '1 hour ago', msg: 'Need a quote for 200 people.' }
  ]);

  topServices = signal([
    { name: 'Royal Grand Ballroom', views: 850, conversion: '12%' },
    { name: 'Intimate Lawn', views: 420, conversion: '8%' }
  ]);

  revenueTarget = signal({
    current: 125000,
    target: 200000,
    percentage: 62
  });

  vendorLevel = signal({
    current: 'Gold Partner',
    next: 'Platinum',
    points: 850,
    needed: 1000
  });

  pendingTasks = signal([
    { id: 't1', title: 'Business Introduction', link: '/vendor/profile' },
    { id: 't2', title: 'Profile KYC', link: '/vendor/verification' },
    { id: 't3', title: 'Images', link: '/vendor/my-services' },
    { id: 't4', title: 'Things to know', link: '/vendor/profile' }
  ]);

  esgScore = signal({
    score: 85,
    offset: '1.2 Tons',
    trend: '+12%'
  });

  pendingCollaborations = signal([
    { id: 'c1', partner: 'Luxe Decorators', category: 'Decor', time: '2 hours ago' },
    { id: 'c2', partner: 'Royal Caterers', category: 'Catering', time: '1 day ago' }
  ]);

  readonly stats = [
    { label: 'Total Earnings', value: '₹8.5L', icon: 'bi-currency-rupee', color: 'var(--success)', bg: 'rgba(22,163,74,0.1)' },
    { label: 'Pending Requests', value: '4', icon: 'bi-clock-history', color: 'var(--warning)', bg: 'rgba(217,119,6,0.1)' },
    { label: 'Upcoming Jobs', value: '3', icon: 'bi-calendar-check', color: 'var(--secondary)', bg: 'rgba(107,33,168,0.1)' },
    { label: 'Overall Rating', value: '4.8 ★', icon: 'bi-star-half', color: 'var(--accent)', bg: 'rgba(245,158,11,0.1)' },
  ];

  ngOnInit() { 
    this.api.getVendorDashboard('v1').subscribe(d => this.dashboard.set(d)); 
    this.api.getVendors().subscribe(v => {
      this.vendorProfile.set(v.find(vendor => vendor.id === 'v1') || null);
    });
  }

  copyProfileLink() {
    navigator.clipboard.writeText(this.shareProfileLink());
    this.toast.success('Profile link copied to clipboard!');
  }

  shareVia(platform: string) {
    const link = encodeURIComponent(this.shareProfileLink());
    const text = encodeURIComponent('Check out my professional portfolio on JoinEvents! ');
    let url = '';

    switch(platform) {
      case 'whatsapp': url = `https://wa.me/?text=${text}${link}`; break;
      case 'facebook': url = `https://www.facebook.com/sharer/sharer.php?u=${link}`; break;
      case 'twitter':  url = `https://twitter.com/intent/tweet?text=${text}&url=${link}`; break;
      case 'linkedin': url = `https://www.linkedin.com/sharing/share-offsite/?url=${link}`; break;
    }

    if (url) window.open(url, '_blank', 'width=600,height=400');
  }

  sendQuickReply(customer: string, type: string = 'Acknowledgement') {
    this.toast.success(`"${type}" reply sent to ${customer}!`);
  }
}
