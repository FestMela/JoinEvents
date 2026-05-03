import { Component, signal, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { inject } from '@angular/core';
import { MockApiService } from '../../core/services/mock-api.service';
import { AuthService } from '../../core/services/auth.service';
import { EventType } from '../../core/models/event.model';

import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-get-start',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './get-start.html',
  styleUrl: './get-start.css'
})
export class GetStart implements OnInit {
  private api = inject(MockApiService);
  private auth = inject(AuthService);
  private router = inject(Router);

  eventTypes = signal<EventType[]>([]);
  currentSlide = signal(0);
  searchQuery = signal('');
  
  readonly quickCategories = [
    { id: 'venues', name: 'Venues', icon: 'bi-building-check', color: '#FF6B35' },
    { id: 'catering', name: 'Catering', icon: 'bi-egg-fried', color: '#6B21A8' },
    { id: 'makeup', name: 'Makeup', icon: 'bi-brush', color: '#D946EF' },
    { id: 'photography', name: 'Photography', icon: 'bi-camera-reels', color: '#0EA5E9' },
    { id: 'decor', name: 'Decor', icon: 'bi-palette', color: '#10B981' },
    { id: 'outfits', name: 'Outfits', icon: 'bi-wardrobe', color: '#F59E0B' }
  ];

  readonly topVenues = signal([
    { id: 'v1', name: 'The Royal Grandeur', city: 'Jaipur', image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=800', capacity: '500-2000 Pax', type: 'Heritage Palace' },
    { id: 'v2', name: 'Seaside Pavilion', city: 'Goa', image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800', capacity: '200-800 Pax', type: 'Beach Resort' },
    { id: 'v3', name: 'Emerald Meadows', city: 'Bangalore', image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&q=80&w=800', capacity: '1000-3000 Pax', type: 'Open Lawn' }
  ]);

  readonly topPlanners = signal([
    { id: 'p1', name: 'DreamCraft Weddings', rating: '4.9', image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=800', label: 'Platinum Partner' },
    { id: 'p2', name: 'Elite Occasions', rating: '4.8', image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=80&w=800', label: 'Curated' },
    { id: 'p3', name: 'Signature Events', rating: '5.0', image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&q=80&w=800', label: 'Top Rated' }
  ]);

  readonly premiumPackages = signal([
    { 
      id: 'pkg1', 
      name: 'The Diamond Wedding Package', 
      price: 5600000, 
      pax: '500 Pax', 
      rooms: '50 Rooms', 
      catering: 'Mix (Veg/Non-Veg)',
      image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=800',
      validity: '15 Days remaining'
    },
    { 
      id: 'pkg2', 
      name: 'Royal Heritage Celebration', 
      price: 3500000, 
      pax: '300 Pax', 
      rooms: '30 Rooms', 
      catering: 'Pure Veg',
      image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800',
      validity: '08 Days remaining'
    }
  ]);

  readonly playbook = [
    { title: 'The Engagement', status: 'completed', icon: 'bi-gem' },
    { title: 'Venue Booking', status: 'active', icon: 'bi-building' },
    { title: 'Vendor Shortlisting', status: 'pending', icon: 'bi-people' },
    { title: 'Final Execution', status: 'pending', icon: 'bi-stars' }
  ];

  ngOnInit() {
    if (this.auth.isAuthenticated()) {
      this.router.navigate([`/${this.auth.getRole()}/dashboard`]);
    }
    this.api.getEventTypes().subscribe(types => this.eventTypes.set(types));
    setInterval(() => {
      this.currentSlide.update(s => (s + 1) % 3);
    }, 4500);
  }

  readonly heroSlides = [
    { title: 'Plan Your Dream Wedding', subtitle: 'Shaadi', bg: 'linear-gradient(135deg,#1E293B 0%,#6B21A8 50%,#E91E8C 100%)' },
    { title: 'Corporate Events That Impress', subtitle: 'Karobar', bg: 'linear-gradient(135deg,#0F172A 0%,#0EA5E9 60%,#6B21A8 100%)' },
    { title: 'Sacred Rituals, Flawlessly Done', subtitle: 'Puja & Hawan', bg: 'linear-gradient(135deg,#1E293B 0%,#D97706 50%,#FF6B35 100%)' },
  ];

  readonly features = [
    { icon: 'bi-shield-check', title: 'Verified Vendors', desc: 'Every vendor goes through a strict verification process' },
    { icon: 'bi-calendar2-check', title: 'Easy Booking', desc: 'Book your event in minutes with advance payment' },
    { icon: 'bi-chat-dots', title: '24/7 Support', desc: 'Our team is always available for any assistance' },
    { icon: 'bi-graph-up', title: 'Live Tracking', desc: 'Monitor your event progress in real time' },
  ];

  isAiChatOpen = signal(false);
  aiInput = '';
  chatMessages = signal<any[]>([
    { id: 1, text: 'Hi! I am your JoinEvents AI Concierge. What kind of event are you planning? (e.g., "Find me an eco-friendly wedding venue under 10 Lakhs")', isUser: false }
  ]);

  toggleAiChat() {
    this.isAiChatOpen.update(v => !v);
  }

  sendAiMessage() {
    if (!this.aiInput.trim()) return;
    
    const userMsg = { id: Date.now(), text: this.aiInput, isUser: true };
    this.chatMessages.update(msgs => [...msgs, userMsg]);
    const currentInput = this.aiInput.toLowerCase();
    this.aiInput = '';

    // Mock AI Response logic
    setTimeout(() => {
      let response = "That's a great question! Let me check our best options for you.";
      if (currentInput.includes('venue')) response = "We have over 500+ premium venues. Are you looking for a palace, a resort, or an open lawn?";
      else if (currentInput.includes('budget')) response = "I can help you find something that fits your budget perfectly. Our packages start from ₹5 Lakhs.";
      else if (currentInput.includes('planner')) response = "Our top-rated planners like DreamCraft can handle everything from decor to catering!";
      
      this.chatMessages.update(msgs => [...msgs, { id: Date.now() + 1, text: response, isUser: false }]);
    }, 1000);
  }

  handleImageError(event: Event) {
    const img = event.target as HTMLImageElement;
    img.style.display = 'none';
    if (img.nextElementSibling) {
      (img.nextElementSibling as HTMLElement).style.display = 'block';
    }
  }
}
