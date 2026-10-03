export interface Treatment {
  id: string;
  name: string;
  category: 'laser' | 'facial' | 'hair' | 'antiaging';
  categoryLabel: string;
  shortDescription: string;
  fullDescription: string;
  duration: string;
  price: number;
  originalPrice?: number;
  isPopular?: boolean;
  image: string;
  benefits: string[];
  recommendedSessions: string;
}

export interface Review {
  id: string;
  author: string;
  avatar: string;
  role: string;
  rating: number;
  date: string;
  treatment: string;
  comment: string;
  verified: boolean;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'ambiance' | 'suites' | 'technology' | 'consultation';
  categoryLabel: string;
  image: string;
  description: string;
}

export interface BookingData {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  serviceId: string;
  serviceName: string;
  date: string;
  timeSlot: string;
  promoCode?: string;
  notes?: string;
  createdAt: string;
}

export interface FaqItem {
  question: string;
  answer: string;
  category: string;
}
