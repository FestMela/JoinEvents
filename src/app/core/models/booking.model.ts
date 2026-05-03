export type BookingStatus = 'pending' | 'advance_paid' | 'confirmed' | 'in_progress' | 'completed' | 'settled' | 'cancelled';

export interface BookingService {
  serviceId: string;
  serviceName: string;
  category: string;
  vendorId: string;
  vendorName: string;
  price: number;
  status: 'pending' | 'confirmed' | 'completed';
}

export interface Booking {
  id: string;
  bookingNumber: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  eventTypeId: string;
  eventName: string;
  packageId?: string;
  packageName?: string;
  eventDate: string;
  venue: string;
  city: string;
  guestCount: number;
  status: BookingStatus;
  advanceAmount: number;
  baseAmount: number;
  extraServicesAmount: number;
  damageCharges: number;
  gstPercent: number;
  totalAmount: number;
  finalPaidAmount?: number;
  services: BookingService[];
  createdAt: string;
  notes?: string;
  assignedTo?: string;
  internalNotes?: string;
  supportLogs?: { date: string, message: string, actor: string }[];
}
