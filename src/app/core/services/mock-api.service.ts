import { Injectable, signal } from '@angular/core';
import { of, Observable } from 'rxjs';
import { delay } from 'rxjs/operators';
import { EventType, EventPackage } from '../models/event.model';
import { Booking } from '../models/booking.model';
import { Vendor, CalendarDay } from '../models/vendor.model';
import { VendorService, ServiceCategoryDef } from '../models/service.model';
import { ChatThread, ChatMessage, SupportTicket } from '../models/message.model';
import { CustomerProfile } from '../models/user.model';
import { Employee, EmployeeRole, EmployeeStatus } from '../models/employee.model';

@Injectable({ providedIn: 'root' })
export class MockApiService {

  // ─── EVENT TYPES ───────────────────────────────────────────────
  getEventTypes(): Observable<EventType[]> {
    return of([
      { id: 'wedding', name: 'Wedding', nameHindi: 'Shaadi', description: 'Grand Indian weddings with all rituals, mehendi, sangeet & reception', icon: 'bi-hearts', category: 'wedding', colorClass: 'event-wedding', gradient: 'linear-gradient(135deg,#E91E8C,#FF6B6B)', startingPrice: 150000, popularServices: ['Venue','Catering','Decoration','Photography','Music','Priest'] },
      { id: 'birthday', name: 'Birthday Party', nameHindi: 'Janmadin', description: 'Fun & vibrant birthday celebrations for all ages', icon: 'bi-balloon-heart', category: 'birthday', colorClass: 'event-birthday', gradient: 'linear-gradient(135deg,#FF6B35,#F59E0B)', startingPrice: 25000, popularServices: ['Venue','Catering','Decoration','Photography','Music'] },
      { id: 'corporate', name: 'Corporate Event', nameHindi: 'Karobar', description: 'Professional corporate meets, conferences, team outings & product launches', icon: 'bi-briefcase', category: 'corporate', colorClass: 'event-corporate', gradient: 'linear-gradient(135deg,#0EA5E9,#6B21A8)', startingPrice: 80000, popularServices: ['Venue','Catering','Transport','Manpower','Photography'] },
      { id: 'beauty', name: 'Beauty & Styling', nameHindi: 'Shringar', icon: 'bi-magic', category: 'beauty', colorClass: 'event-beauty', gradient: 'linear-gradient(135deg,#EC4899,#D946EF)', startingPrice: 5000, popularServices: ['Makeup','Hairstyle','Outfit Rental','Mehendi'] },
      { id: 'travel', name: 'Travel & Transport', nameHindi: 'Yatra', icon: 'bi-airplane-fill', category: 'travel', colorClass: 'event-travel', gradient: 'linear-gradient(135deg,#10B981,#059669)', startingPrice: 8000, popularServices: ['Luxury Cars','Bus Hire','Honeymoon Packages'] },
      { id: 'shopping', name: 'Event Shopping', nameHindi: 'Kharidari', icon: 'bi-bag-heart-fill', category: 'shopping', colorClass: 'event-shopping', gradient: 'linear-gradient(135deg,#F59E0B,#D97706)', startingPrice: 2000, popularServices: ['Invites','Gifts','Traditional Wear'] },
    ] as EventType[]).pipe(delay(300));
  }

  // ─── PACKAGES ──────────────────────────────────────────────────
  getPackages(eventTypeId?: string): Observable<any[]> {
    const packages: any[] = [
      { 
        id: 'w-prem-1', 
        eventTypeId: 'wedding', 
        name: 'Diamond Wedding Package', 
        vendorName: 'Hotel Mansingh',
        venueName: 'The Royal Ballroom',
        location: 'Agra, Uttar Pradesh, India',
        tier: 'premium', 
        price: 5600000, 
        description: 'Luxury wedding at the heart of Agra with Taj views. Experience unparalleled elegance in our signature ballroom, featuring custom crystal chandeliers and a dedicated staff of 50 to ensure every moment is perfect.', 
        services: ['VIP Valet Parking','Gourmet 5-Course Dinner','Designer Stage Decor','Drone Photography','Live Sufi Band','Premium Bridal Suite'], 
        addons: [
          { id: 'a1', name: 'Vintage Car Entry', price: 25000 },
          { id: 'a2', name: 'Cold Fire Pyro', price: 15000 },
          { id: 'a3', name: 'Live Mehendi Artists', price: 10000 }
        ],
        maxGuests: 700, 
        durationHours: 48, 
        isPopular: true, 
        offerExpiresIn: '7 Days, 9:21:50',
        vegOnly: true,
        roomCount: 2,
        sustainabilityTags: ['Zero Waste Catering', 'Local Sourced'],
        image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=800'
      },
      { 
        id: 'w-prem-2', 
        eventTypeId: 'wedding', 
        name: 'Royal Heritage Wedding', 
        vendorName: 'Umaid Bhawan',
        venueName: 'Heritage Courtyard',
        location: 'Jodhpur, Rajasthan, India',
        tier: 'premium', 
        price: 8500000, 
        description: 'A true royal experience in the blue city. Celebrate like royalty in the historic courtyard of Umaid Bhawan, surrounded by centuries of heritage and the finest Rajasthani hospitality.', 
        services: ['Heritage Venue','Royal Rajputana Feast','Elephant Grand Entry','Traditional Folk Music','Palace Fireworks'], 
        addons: [
          { id: 'a4', name: 'Camel Parade', price: 45000 },
          { id: 'a5', name: 'Royal Guard Welcome', price: 20000 }
        ],
        maxGuests: 500, 
        durationHours: 72, 
        offerExpiresIn: '3 Days, 4:10:00',
        vegOnly: false,
        roomCount: 50,
        image: 'https://images.unsplash.com/photo-1541010222019-15ad350bc51f?auto=format&fit=crop&q=80&w=800'
      },
      { 
        id: 'w-std-1', 
        eventTypeId: 'wedding', 
        name: 'Elegant Garden Wedding', 
        vendorName: 'Green Meadows',
        venueName: 'The Secret Garden',
        location: 'Bangalore, Karnataka, India',
        tier: 'standard', 
        price: 2500000, 
        description: 'Sustainable and beautiful garden wedding. A lush, green escape within the city, perfect for intimate gatherings and nature lovers seeking a serene celebration.', 
        services: ['Outdoor Venue','Organic Farm-to-Table Menu','Recycled Floral Decor','Acoustic Music Set'], 
        addons: [
          { id: 'a6', name: 'Flower Shower', price: 12000 }
        ],
        maxGuests: 400, 
        durationHours: 12, 
        offerExpiresIn: '5 Days, 12:00:00',
        vegOnly: true,
        roomCount: 5,
        sustainabilityTags: ['Organic Menu', 'Recycled Decor'],
        image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=800'
      },
      { id: 'b-basic', eventTypeId: 'birthday', name: 'Fun Birthday', tier: 'basic', price: 25000, description: 'Simple & cheerful birthday party setup', services: ['Venue (50 guests)','Snacks & Cake','Balloon Decoration','Photography'], maxGuests: 50, durationHours: 4, location: 'Local Venue', image: 'https://images.unsplash.com/photo-1530103862676-fa8c9d34b3b3?auto=format&fit=crop&q=80&w=800' },
    ];
    const result = eventTypeId ? packages.filter(p => p.eventTypeId === eventTypeId) : packages;
    return of(result).pipe(delay(300));
  }

  // ─── BOOKINGS ──────────────────────────────────────────────────
  getBookings(customerId?: string): Observable<Booking[]> {
    const bookings: Booking[] = [
      { id: 'bk001', bookingNumber: 'EE-2025-001', customerId: 'c1', customerName: 'Rajesh Kumar', customerPhone: '+91 98765 43210', eventTypeId: 'wedding', eventName: 'Wedding Reception', packageId: 'w-std', packageName: 'Gold Wedding', eventDate: '2025-12-15', venue: 'Raj Mahal Banquet Hall', city: 'Hyderabad', guestCount: 450, status: 'confirmed', advanceAmount: 70000, baseAmount: 350000, extraServicesAmount: 45000, damageCharges: 0, gstPercent: 18, totalAmount: 464100, services: [{ serviceId: 's1', serviceName: 'Premium Catering', category: 'catering', vendorId: 'v1', vendorName: 'Spice Garden Catering', price: 25000, status: 'confirmed' },{ serviceId: 's2', serviceName: 'Floral Decoration', category: 'decoration', vendorId: 'v2', vendorName: 'Blooms & Bliss', price: 20000, status: 'confirmed' }], createdAt: '2025-10-01', notes: 'VIP table for 20 family members' },
      { id: 'bk002', bookingNumber: 'EE-2025-002', customerId: 'c1', customerName: 'Rajesh Kumar', customerPhone: '+91 98765 43210', eventTypeId: 'birthday', eventName: "Daughter's 10th Birthday", packageId: 'b-std', packageName: 'Party Birthday', eventDate: '2025-11-20', venue: 'Fun Zone Party Hall', city: 'Hyderabad', guestCount: 80, status: 'settled', advanceAmount: 12000, baseAmount: 60000, extraServicesAmount: 8000, damageCharges: 2000, gstPercent: 18, totalAmount: 82600, finalPaidAmount: 82600, services: [], createdAt: '2025-09-15' },
      { id: 'bk003', bookingNumber: 'EE-2026-001', customerId: 'c1', customerName: 'Rajesh Kumar', customerPhone: '+91 98765 43210', eventTypeId: 'religious', eventName: 'Gruhapravesh Puja', packageId: 'r-std', packageName: 'Full Puja', eventDate: '2026-05-10', venue: 'Home', city: 'Hyderabad', guestCount: 40, status: 'pending', advanceAmount: 0, baseAmount: 40000, extraServicesAmount: 0, damageCharges: 0, gstPercent: 18, totalAmount: 47200, services: [], createdAt: '2026-04-20' },
    ];
    const result = customerId ? bookings.filter(b => b.customerId === customerId) : bookings;
    return of(result).pipe(delay(300));
  }

  getAdminBookings(): Observable<Booking[]> {
    return of<Booking[]>([
      { 
        id: 'bk001', bookingNumber: 'EE-2025-001', customerId: 'c1', customerName: 'Rajesh Kumar', customerPhone: '+91 98765 43210', eventTypeId: 'wedding', eventName: 'Wedding Reception', packageId: 'w-std', packageName: 'Gold Wedding', eventDate: '2025-12-15', venue: 'Raj Mahal Banquet Hall', city: 'Hyderabad', guestCount: 450, status: 'confirmed', advanceAmount: 70000, baseAmount: 350000, extraServicesAmount: 45000, damageCharges: 0, gstPercent: 18, totalAmount: 464100, 
        services: [
          { serviceId: 's1', serviceName: 'Premium Catering', category: 'catering', vendorId: 'v1', vendorName: 'Spice Garden Catering', price: 25000, status: 'confirmed' },
          { serviceId: 's2', serviceName: 'Floral Decoration', category: 'decoration', vendorId: 'v2', vendorName: 'Blooms & Bliss', price: 20000, status: 'confirmed' }
        ], 
        createdAt: '2025-10-01', assignedTo: 'Priya Nair',
        internalNotes: 'VIP customer, prefers floral decor in pastel shades.',
        supportLogs: [
          { date: '2025-10-02', message: 'Welcome call done. Explained the process.', actor: 'Priya' },
          { date: '2025-10-05', message: 'Vendor V1 confirmed the menu.', actor: 'Priya' }
        ]
      },
      { 
        id: 'bk002', bookingNumber: 'EE-2025-002', customerId: 'c1', customerName: 'Rajesh Kumar', customerPhone: '+91 98765 43210', eventTypeId: 'birthday', eventName: "Daughter's 10th Birthday", eventDate: '2025-11-20', venue: 'Fun Zone Party Hall', city: 'Hyderabad', guestCount: 80, status: 'settled', advanceAmount: 12000, baseAmount: 60000, extraServicesAmount: 8000, damageCharges: 2000, gstPercent: 18, totalAmount: 82600, services: [], createdAt: '2025-09-15', assignedTo: 'Rahul Support',
        supportLogs: [{ date: '2025-09-16', message: 'Payment verified.', actor: 'System' }]
      },
      { id: 'bk004', bookingNumber: 'EE-2026-002', customerId: 'c2', customerName: 'Sunita Patel', customerPhone: '+91 97654 32109', eventTypeId: 'corporate', eventName: 'Annual Day Conference', packageId: 'c-std', packageName: 'Corporate Event', eventDate: '2026-06-05', venue: 'Novotel Business Center', city: 'Bangalore', guestCount: 150, status: 'advance_paid', advanceAmount: 40000, baseAmount: 200000, extraServicesAmount: 25000, damageCharges: 0, gstPercent: 18, totalAmount: 265300, services: [], createdAt: '2026-04-01', assignedTo: 'Priya Nair' },
      { id: 'bk005', bookingNumber: 'EE-2026-003', customerId: 'c3', customerName: 'Anand Reddy', customerPhone: '+91 96543 21098', eventTypeId: 'religious', eventName: 'Upanayanam Ceremony', packageId: 'r-prem', packageName: 'Grand Hawan', eventDate: '2026-07-15', venue: 'Community Hall', city: 'Chennai', guestCount: 180, status: 'in_progress', advanceAmount: 24000, baseAmount: 120000, extraServicesAmount: 15000, damageCharges: 0, gstPercent: 18, totalAmount: 160300, services: [], createdAt: '2026-03-20', assignedTo: 'Rahul Support' },
    ]).pipe(delay(300));
  }

  addSupportLog(bookingId: string, message: string, actor: string): Observable<boolean> {
    // In a real app we would update the list. For mock, we just return true.
    return of(true).pipe(delay(500));
  }

  remindVendor(vendorId: string, bookingId: string): Observable<boolean> {
    return of(true).pipe(delay(1000));
  }

  // ─── VENDORS ───────────────────────────────────────────────────
  globalVendors = signal<Vendor[]>([
    { id: 'v1', name: 'Amit Sharma', businessName: 'Spice Garden Catering', email: 'vendor@demo.com', phone: '+91 91234 56789', city: 'Hyderabad', services: ['catering'], isVerified: true, sustainabilityTags: ['Zero Waste Catering', 'Local Sourced'], verificationStatus: 'verified', verificationDocs: [{ type: 'FSSAI License', name: 'fssai.pdf', uploadedAt: '2025-01-10', status: 'approved' },{ type: 'GST Certificate', name: 'gst.pdf', uploadedAt: '2025-01-10', status: 'approved' }], rating: 4.8, totalReviews: 245, totalEarnings: 850000, joinedDate: '2025-01-01', gstNumber: '36AABCU9603R1ZX', accountStatus: 'active' },
    { id: 'v2', name: 'Meera Krishnan', businessName: 'Blooms & Bliss Decor', email: 'meera@blooms.com', phone: '+91 92345 67890', city: 'Hyderabad', services: ['decoration'], isVerified: true, sustainabilityTags: ['Eco-friendly Decor', 'Reusable Materials'], verificationStatus: 'verified', verificationDocs: [{ type: 'Business Registration', name: 'reg.pdf', uploadedAt: '2025-02-15', status: 'approved' }], rating: 4.9, totalReviews: 312, totalEarnings: 650000, joinedDate: '2025-02-01', accountStatus: 'active' },
    { id: 'v3', name: 'Ravi Shankar', businessName: 'Palace Grounds Venue', email: 'ravi@palace.com', phone: '+91 93456 78901', city: 'Bangalore', services: ['venue'], isVerified: false, sustainabilityTags: ['LEED Certified'], verificationStatus: 'under_review', verificationDocs: [{ type: 'Property Documents', name: 'prop.pdf', uploadedAt: '2026-04-01', status: 'pending' },{ type: 'Fire NOC', name: 'noc.pdf', uploadedAt: '2026-04-01', status: 'pending' }], rating: 0, totalReviews: 0, totalEarnings: 0, joinedDate: '2026-04-01', accountStatus: 'active' },
    { id: 'v4', name: 'Pandu Subramanian', businessName: 'Royal Fleet Transport', email: 'pandu@royalfleet.com', phone: '+91 94567 89012', city: 'Chennai', services: ['transport'], verificationStatus: 'pending', verificationDocs: [], rating: 0, totalReviews: 0, totalEarnings: 0, joinedDate: '2026-04-18', accountStatus: 'active' },
    { id: 'v5', name: 'Pandit Gopal Das', businessName: 'Vedic Rituals', email: 'gopaldas@vedic.com', phone: '+91 95678 90123', city: 'Hyderabad', services: ['priest'], verificationStatus: 'verified', verificationDocs: [{ type: 'Certificate', name: 'vedic.pdf', uploadedAt: '2025-06-01', status: 'approved' }], rating: 4.7, totalReviews: 180, totalEarnings: 320000, joinedDate: '2025-06-01', accountStatus: 'suspended' },
  ]);

  getVendors(): Observable<Vendor[]> {
    return of(this.globalVendors()).pipe(delay(300));
  }

  moderateVendor(vendorId: string, action: 'suspend' | 'ban' | 'reactivate', reason?: string, duration?: string): Observable<boolean> {
    this.globalVendors.update(vendors => 
      vendors.map(v => {
        if (v.id === vendorId) {
          const status = action === 'suspend' ? 'suspended' : action === 'ban' ? 'banned' : 'active';
          return { 
            ...v, 
            accountStatus: status,
            suspensionReason: action !== 'reactivate' ? reason : undefined,
            suspensionDuration: action === 'suspend' ? duration : undefined
          };
        }
        return v;
      })
    );
    return of(true).pipe(delay(300));
  }

  // ─── CUSTOMERS ────────────────────────────────────────────────
  globalCustomers = signal<CustomerProfile[]>([
    { id: 'c1', name: 'Rajesh Kumar', email: 'customer@demo.com', phone: '+91 98765 43210', city: 'Hyderabad', totalBookings: 3, totalSpent: 546700, joinedDate: '2025-09-01', accountStatus: 'active', role: 'customer', loyaltyPoints: 450, strikes: 0 },
    { id: 'c2', name: 'Sunita Patel', email: 'sunita@demo.com', phone: '+91 97654 32109', city: 'Bangalore', totalBookings: 1, totalSpent: 265300, joinedDate: '2026-03-10', accountStatus: 'active', role: 'customer', loyaltyPoints: 120, strikes: 0 },
    { id: 'c3', name: 'Anand Reddy', email: 'anand@demo.com', phone: '+91 96543 21098', city: 'Chennai', totalBookings: 2, totalSpent: 307500, joinedDate: '2026-01-15', accountStatus: 'warning', role: 'customer', loyaltyPoints: 200, strikes: 1, suspensionReason: 'Frequent cancellations' },
    { id: 'c4', name: 'Meena Sharma', email: 'meena@demo.com', phone: '+91 95432 10987', city: 'Mumbai', totalBookings: 0, totalSpent: 0, joinedDate: '2026-04-18', accountStatus: 'active', role: 'customer', loyaltyPoints: 0, strikes: 0 },
  ]);

  getCustomers(): Observable<CustomerProfile[]> {
    return of(this.globalCustomers()).pipe(delay(300));
  }

  moderateCustomer(customerId: string, action: 'warn' | 'restrict' | 'suspend' | 'ban' | 'reactivate', reason?: string, duration?: string): Observable<boolean> {
    this.globalCustomers.update(customers => 
      customers.map(c => {
        if (c.id === customerId) {
          let status = c.accountStatus;
          let strikes = c.strikes || 0;

          if (action === 'warn') {
            status = 'warning';
            strikes++;
          } else if (action === 'restrict') {
            status = 'restricted';
          } else if (action === 'suspend') {
            status = 'suspended';
          } else if (action === 'ban') {
            status = 'banned';
          } else if (action === 'reactivate') {
            status = 'active';
            strikes = 0;
          }

          return { 
            ...c, 
            accountStatus: status as any,
            strikes,
            suspensionReason: action !== 'reactivate' ? reason : undefined,
            suspensionDuration: action === 'suspend' ? duration : undefined
          };
        }
        return c;
      })
    );
    return of(true).pipe(delay(300));
  }
  getVendorServices(vendorId?: string): Observable<VendorService[]> {
    const services: VendorService[] = [
      { id: 'vs1', vendorId: 'v1', vendorName: 'Spice Garden Catering', category: 'catering', name: 'Premium Veg Catering', description: 'Authentic South Indian & North Indian multi-cuisine veg catering', pricePerUnit: 450, unit: 'per plate', minGuests: 100, maxGuests: 1000, city: 'Hyderabad', images: [], rating: 4.8, totalReviews: 245, isActive: true, isVerified: true },
      { id: 'vs2', vendorId: 'v1', vendorName: 'Spice Garden Catering', category: 'catering', name: 'Non-Veg Catering Deluxe', description: 'Premium non-veg multi-cuisine catering with live counters', pricePerUnit: 650, unit: 'per plate', minGuests: 50, maxGuests: 800, city: 'Hyderabad', images: [], rating: 4.7, totalReviews: 198, isActive: true, isVerified: true },
      { id: 'vs3', vendorId: 'v2', vendorName: 'Blooms & Bliss Decor', category: 'decoration', name: 'Royal Floral Decoration', description: 'Luxury floral stage & hall decoration with fresh flowers', pricePerUnit: 75000, unit: 'per event', city: 'Hyderabad', images: [], rating: 4.9, totalReviews: 312, isActive: true, isVerified: true },
      { id: 'vs4', vendorId: 'v5', vendorName: 'Vedic Rituals', category: 'priest', name: 'Wedding Priest Service', description: 'Expert Vedic priest for all wedding rituals in Telugu, Sanskrit, Hindi', pricePerUnit: 8000, unit: 'per event', city: 'Hyderabad', images: [], rating: 4.7, totalReviews: 180, isActive: true, isVerified: true },
      { id: 'vs5', vendorId: 'v1', vendorName: 'Spice Garden Catering', category: 'catering', name: 'Gourmet Dessert Counter', description: 'Premium live dessert counters with international delicacies', pricePerUnit: 150, unit: 'per plate', minGuests: 100, maxGuests: 500, city: 'Hyderabad', images: [], rating: 0, totalReviews: 0, isActive: true, isVerified: false },
    ];
    const result = vendorId ? services.filter(s => s.vendorId === vendorId) : services;
    return of(result).pipe(delay(300));
  }

  // ─── SERVICE CATEGORIES ────────────────────────────────────────
  getServiceCategories(): Observable<ServiceCategoryDef[]> {
    return of<ServiceCategoryDef[]>([
      { id: 'venue',       name: 'Venue',        icon: 'bi-building',      description: 'Banquet halls, lawns, resorts & farmhouses' },
      { id: 'catering',    name: 'Catering',     icon: 'bi-egg-fried',     description: 'Veg, non-veg & live food counters' },
      { id: 'decoration',  name: 'Decoration',   icon: 'bi-flower1',       description: 'Floral, theme & stage decoration' },
      { id: 'transport',   name: 'Transport',    icon: 'bi-car-front',     description: 'Buses, cars & luxury fleets' },
      { id: 'priest',      name: 'Priest',       icon: 'bi-fire',          description: 'Vedic priests for all rituals' },
      { id: 'manpower',    name: 'Manpower',     icon: 'bi-people',        description: 'Event staff, waiters & security' },
      { id: 'photography', name: 'Photography',  icon: 'bi-camera',        description: 'Professional photos & videos' },
      { id: 'music',       name: 'Music & DJ',   icon: 'bi-music-note-beamed', description: 'DJs, live bands & sound systems' },
    ]).pipe(delay(200));
  }

  // ─── CALENDAR ──────────────────────────────────────────────────
  getVendorCalendar(vendorId: string, month: number, year: number): Observable<CalendarDay[]> {
    const days: CalendarDay[] = [];
    const daysInMonth = new Date(year, month, 0).getDate();
    const bookedDays = [3, 7, 12, 18, 24, 28];
    const blockedDays = [1, 15];
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${String(month).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
      let status: CalendarDay['status'] = 'available';
      if (bookedDays.includes(d)) status = 'booked';
      else if (blockedDays.includes(d)) status = 'blocked';
      days.push({ date: dateStr, status });
    }
    return of(days).pipe(delay(300));
  }

  // ─── MESSAGES ──────────────────────────────────────────────────
  getChatThreads(userId: string): Observable<ChatThread[]> {
    if (userId.startsWith('v')) {
      return of<ChatThread[]>([
        { id: 'vth1', bookingId: 'bk001', participants: [{ id: 'c1', name: 'Rajesh Kumar', role: 'customer' },{ id: 'v1', name: 'Amit Sharma', role: 'vendor' }], lastMessage: 'Thank you for the quote. Can we negotiate on the dessert counter?', lastMessageTime: new Date().toISOString(), unreadCount: 1, subject: 'Wedding Catering Inquiry' },
        { id: 'vth2', bookingId: 'bk004', participants: [{ id: 'c2', name: 'Sunita Patel', role: 'customer' },{ id: 'v1', name: 'Amit Sharma', role: 'vendor' }], lastMessage: 'Is the menu finalized for the corporate event?', lastMessageTime: new Date().toISOString(), unreadCount: 0, subject: 'Annual Day Conference' },
      ]).pipe(delay(300));
    }
    return of<ChatThread[]>([
      { id: 'th1', bookingId: 'bk001', participants: [{ id: 'c1', name: 'Rajesh Kumar', role: 'customer' },{ id: 'a1', name: 'Priya Nair', role: 'admin' }], lastMessage: 'We have confirmed the decoration vendor for your wedding.', lastMessageTime: '2025-10-10T14:30:00', unreadCount: 2, subject: 'EE-2025-001 | Wedding Reception' },
      { id: 'th2', bookingId: 'bk003', participants: [{ id: 'c1', name: 'Rajesh Kumar', role: 'customer' },{ id: 'a1', name: 'Priya Nair', role: 'admin' }], lastMessage: 'Your advance payment has been received. Booking confirmed!', lastMessageTime: '2026-04-20T09:15:00', unreadCount: 0, subject: 'EE-2026-001 | Gruhapravesh Puja' },
    ]).pipe(delay(300));
  }

  getChatMessages(threadId: string): Observable<ChatMessage[]> {
    return of<ChatMessage[]>([
      { id: 'm1', threadId: 'th1', senderId: 'c1', senderName: 'Rajesh Kumar', senderRole: 'customer', content: 'Hello, I wanted to confirm about the decoration vendor for my wedding.', timestamp: '2025-10-10T10:00:00', isRead: true, type: 'text' },
      { id: 'm2', threadId: 'th1', senderId: 'a1', senderName: 'Priya Nair', senderRole: 'admin', content: 'Hi Rajesh! Sure, let me check the availability for your date.', timestamp: '2025-10-10T10:05:00', isRead: true, type: 'text' },
      { id: 'm3', threadId: 'th1', senderId: 'a1', senderName: 'Priya Nair', senderRole: 'admin', content: 'Great news! Blooms & Bliss is available on Dec 15. I\'ve assigned them to your booking.', timestamp: '2025-10-10T10:15:00', isRead: true, type: 'text' },
      { id: 'm4', threadId: 'th1', senderId: 'c1', senderName: 'Rajesh Kumar', senderRole: 'customer', content: 'Wonderful! Thank you so much for the quick response 🙏', timestamp: '2025-10-10T10:20:00', isRead: true, type: 'text' },
      { id: 'm5', threadId: 'th1', senderId: 'a1', senderName: 'Priya Nair', senderRole: 'admin', content: 'We have confirmed the decoration vendor for your wedding.', timestamp: '2025-10-10T14:30:00', isRead: false, type: 'text' },
    ]).pipe(delay(300));
  }

  // ─── SUPPORT TICKETS ───────────────────────────────────────────
  getSupportTickets(): Observable<SupportTicket[]> {
    return of<SupportTicket[]>([
      { id: 'st1', customerId: 'c1', customerName: 'Rajesh Kumar', subject: 'Decoration vendor not responding', status: 'open', priority: 'high', createdAt: '2025-10-09T08:00:00', messages: [] },
      { id: 'st2', customerId: 'c2', customerName: 'Sunita Patel', subject: 'Need to change event date', status: 'in_progress', priority: 'medium', createdAt: '2026-04-10T11:00:00', messages: [] },
      { id: 'st3', customerId: 'c3', customerName: 'Anand Reddy', subject: 'Catering quality issue after event', status: 'resolved', priority: 'urgent', createdAt: '2026-03-28T16:00:00', messages: [] },
    ]).pipe(delay(300));
  }

  // ─── ADMIN DASHBOARD ───────────────────────────────────────────
  getAdminKPIs(): Observable<any> {
    return of({
      totalRevenue: 6420000,
      activeEvents: 18,
      pendingVerifications: 5,
      totalCustomers: 312,
      totalVendors: 64,
      completedEvents: 428,
      openTickets: 12,
      monthlyRevenue: [280000, 350000, 420000, 310000, 580000, 620000, 490000, 850000, 720000, 940000, 1150000, 1380000],
    }).pipe(delay(300));
  }

  // ─── VENDOR DASHBOARD ──────────────────────────────────────────
  getVendorDashboard(vendorId: string): Observable<any> {
    return of({
      totalEarnings: 850000,
      pendingRequests: 4,
      upcomingBookings: 3,
      completedJobs: 87,
      rating: 4.8,
      thisMonthEarnings: 125000,
      recentRequests: [
        { id: 'br1', bookingId: 'bk001', customerName: 'Rajesh Kumar', eventDate: '2025-12-15', eventName: 'Wedding Reception', amount: 25000, status: 'pending' },
        { id: 'br2', bookingId: 'bk004', customerName: 'Sunita Patel', eventDate: '2026-06-05', eventName: 'Annual Day Conference', amount: 40000, status: 'pending' },
      ]
    }).pipe(delay(300));
  }
  // ─── NOTIFICATIONS ─────────────────────────────────────────────
  getNotifications(): Observable<any[]> {
    return of([
      { id: 'n1', title: 'Booking Confirmed', message: 'Your booking for Wedding Reception has been confirmed.', time: '2 mins ago', icon: 'bi-check-circle', color: '#10B981', isRead: false },
      { id: 'n2', title: 'New Message', message: 'You have a new message from Priya Nair regarding your event.', time: '1 hour ago', icon: 'bi-chat-dots', color: '#3B82F6', isRead: false },
      { id: 'n3', title: 'Payment Received', message: 'Advance payment for Gruhapravesh Puja received successfully.', time: '5 hours ago', icon: 'bi-credit-card', color: '#F59E0B', isRead: true },
      { id: 'n4', title: 'Verification Update', message: 'Your vendor verification is now in progress.', time: '1 day ago', icon: 'bi-shield-check', color: '#8B5CF6', isRead: true },
      { id: 'n5', title: 'New Customer Review', message: 'Rajesh Kumar left a 5-star review for Daughter\'s Birthday.', time: 'Just now', icon: 'bi-star-fill', color: '#F59E0B', isRead: false },
    ]).pipe(delay(300));
  }
  
  // ─── REVIEWS & MODERATION ──────────────────────────────────────────
  
  globalReviews = signal<any[]>([
    { 
      id: 'rev1', 
      bookingId: 'bk002', 
      vendorId: 'v1', 
      customerName: 'Rajesh Kumar', 
      eventName: "Daughter's Birthday", 
      rating: 5, 
      comment: "Fantastic service! The decor was exactly as requested and the food was delicious. Highly recommend this vendor.", 
      date: '2025-11-22',
      status: 'published', // 'published', 'flagged', 'removed'
      disputeReason: ''
    },
    { 
      id: 'rev2', 
      bookingId: 'bk009', 
      vendorId: 'v1', 
      customerName: 'Anita Singh', 
      eventName: "Corporate Gala", 
      rating: 1, 
      comment: "Worst service ever. They didn't show up on time and the food was cold. Completely ruined the event.", 
      date: '2026-02-14',
      status: 'flagged', 
      disputeReason: 'Fake review. This customer cancelled the booking 2 days prior and we never provided service.'
    }
  ]);

  flagReview(reviewId: string, reason: string): Observable<boolean> {
    this.globalReviews.update(reviews => 
      reviews.map(r => r.id === reviewId ? { ...r, status: 'flagged', disputeReason: reason } : r)
    );
    return of(true).pipe(delay(500));
  }

  resolveDispute(reviewId: string, action: 'keep' | 'remove'): Observable<boolean> {
    this.globalReviews.update(reviews => 
      reviews.map(r => {
        if (r.id === reviewId) {
          return { 
            ...r, 
            status: action === 'keep' ? 'published' : 'removed',
            resolution: action,
            resolvedOn: new Date().toISOString().split('T')[0]
          };
        }
        return r;
      })
    );
    return of(true).pipe(delay(500));
  }

  submitReview(bookingId: string, vendorId: string, customerName: string, eventName: string, rating: number, comment: string): Observable<any> {
    const newRev = {
      id: 'rev' + Math.floor(Math.random() * 10000),
      bookingId,
      vendorId,
      customerName,
      eventName,
      rating,
      comment,
      date: new Date().toISOString().split('T')[0],
      status: 'published',
      disputeReason: ''
    };
    this.globalReviews.update(reviews => {
      const existingIdx = reviews.findIndex(r => r.bookingId === bookingId);
      if (existingIdx > -1) {
        const updated = [...reviews];
        updated[existingIdx] = { ...updated[existingIdx], rating, comment, status: 'published', disputeReason: '', date: newRev.date };
        return updated;
      }
      return [...reviews, newRev];
    });
    return of(newRev).pipe(delay(500));
  }

  // ─── EMPLOYEE MANAGEMENT ──────────────────────────────────────
  globalEmployees = signal<Employee[]>([
    { id: 'e1', name: 'Priya Nair', email: 'admin@demo.com', phone: '+91 99887 76655', employeeId: 'ADM-0001', role: 'admin', department: 'Platform Operations', designation: 'Chief Administrator', shift: 'General (9 AM – 6 PM)', joinedDate: '2024-06-15', status: 'active', lastLogin: '2026-05-02 09:15 AM', ticketsResolved: 0, performanceScore: 98 },
    { id: 'e2', name: 'Rahul Support', email: 'support@demo.com', phone: '+91 99000 11223', employeeId: 'SUP-7729', role: 'support', department: 'Customer Satisfaction', designation: 'Support Officer', shift: 'General (9 AM – 6 PM)', joinedDate: '2025-03-10', status: 'active', lastLogin: '2026-05-02 08:47 AM', ticketsResolved: 347, performanceScore: 92 },
    { id: 'e3', name: 'Kavitha Reddy', email: 'kavitha@joinevents.com', phone: '+91 98112 33445', employeeId: 'SUP-7730', role: 'support', department: 'Customer Satisfaction', designation: 'Senior Support Agent', shift: 'Evening (2 PM – 10 PM)', joinedDate: '2025-01-20', status: 'active', lastLogin: '2026-05-01 09:58 PM', ticketsResolved: 512, performanceScore: 96 },
    { id: 'e4', name: 'Arun Mehta', email: 'arun@joinevents.com', phone: '+91 97001 22334', employeeId: 'MOD-4401', role: 'moderator', department: 'Content & Trust', designation: 'Content Moderator', shift: 'General (9 AM – 6 PM)', joinedDate: '2025-06-05', status: 'active', lastLogin: '2026-05-01 06:12 PM', ticketsResolved: 180, performanceScore: 88 },
    { id: 'e5', name: 'Deepa Sharma', email: 'deepa@joinevents.com', phone: '+91 96223 44556', employeeId: 'FIN-3301', role: 'finance', department: 'Finance & Settlements', designation: 'Finance Analyst', shift: 'General (9 AM – 6 PM)', joinedDate: '2025-02-14', status: 'active', lastLogin: '2026-05-02 10:02 AM', ticketsResolved: 0, performanceScore: 94 },
    { id: 'e6', name: 'Vikram Singh', email: 'vikram@joinevents.com', phone: '+91 95334 55667', employeeId: 'SUP-7731', role: 'support', department: 'Customer Satisfaction', designation: 'Night Shift Support', shift: 'Night (10 PM – 6 AM)', joinedDate: '2025-08-22', status: 'on_leave', lastLogin: '2026-04-28 05:55 AM', ticketsResolved: 203, performanceScore: 85 },
    { id: 'e7', name: 'Neha Gupta', email: 'neha@joinevents.com', phone: '+91 94445 66778', employeeId: 'MOD-4402', role: 'moderator', department: 'Content & Trust', designation: 'Review Moderator', shift: 'General (9 AM – 6 PM)', joinedDate: '2025-09-01', status: 'suspended', lastLogin: '2026-04-15 11:30 AM', ticketsResolved: 94, performanceScore: 62, suspensionReason: 'Policy violation — unauthorized data export' },
    { id: 'e8', name: 'Sanjay Patel', email: 'sanjay@joinevents.com', phone: '+91 93556 77889', employeeId: 'ADM-0002', role: 'admin', department: 'Platform Operations', designation: 'Operations Manager', shift: 'General (9 AM – 6 PM)', joinedDate: '2024-11-01', status: 'active', lastLogin: '2026-05-02 08:30 AM', ticketsResolved: 0, performanceScore: 95 },
  ]);

  getEmployees(): Observable<Employee[]> {
    return of(this.globalEmployees()).pipe(delay(300));
  }

  addEmployee(emp: Omit<Employee, 'id'>): Observable<Employee> {
    const newEmp: Employee = { ...emp, id: 'e' + Math.floor(Math.random() * 100000) } as Employee;
    this.globalEmployees.update(list => [...list, newEmp]);
    return of(newEmp).pipe(delay(400));
  }

  updateEmployee(id: string, updates: Partial<Employee>): Observable<boolean> {
    this.globalEmployees.update(list =>
      list.map(e => e.id === id ? { ...e, ...updates } : e)
    );
    return of(true).pipe(delay(300));
  }

  updateEmployeeStatus(id: string, status: EmployeeStatus, reason?: string): Observable<boolean> {
    this.globalEmployees.update(list =>
      list.map(e => {
        if (e.id === id) {
          return { ...e, status, suspensionReason: status === 'suspended' ? reason : undefined };
        }
        return e;
      })
    );
    return of(true).pipe(delay(300));
  }
}
