export type EventCategory = 'wedding' | 'birthday' | 'corporate' | 'religious' | 'social' | 'custom' | 'beauty' | 'travel' | 'shopping';

export interface EventType {
  id: string;
  name: string;
  nameHindi?: string;
  description?: string;
  icon: string;
  category: EventCategory;
  colorClass?: string;
  gradient?: string;
  startingPrice?: number;
  popularServices?: string[];
}

export interface EventPackage {
  id: string;
  eventTypeId: string;
  name: string;
  tier: 'basic' | 'standard' | 'premium';
  price: number;
  description: string;
  services: string[];
  maxGuests: number;
  durationHours: number;
  isPopular?: boolean;
  offerExpiresIn?: string;
  insurancePrice?: number;
  image?: string;
  images?: string[];
  addons?: { id: string, name: string, price: number }[];
  sustainabilityTags?: string[];
}
