export interface Tag {
  id: string;
  name: string;
  category: 'personalities' | 'themes' | 'formats';
  icon: string;
}

export interface Place {
  id: string;
  name: string;
  description: string;
  coordinates: [number, number];
  category: 'gastronomy' | 'attractions' | 'interesting' | 'culture' | 'nature' | 'shopping' | 'nightlife';
  tags: string[];
  rating: number;
  photos: string[];
  businessInfo?: {
    name: string;
    phone?: string;
    website?: string;
    workingHours?: string;
    isPremium: boolean;
  };
}

export interface Route {
  id: string;
  name: string;
  places: Place[];
  distance: number;
  duration: number;
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
  description?: string;
  createdAt?: Date;
}

export interface PredefinedRoute {
  id: string;
  name: string;
  description: string;
  category: string;
  rating: number;
  duration: number;
  difficulty: 'easy' | 'medium' | 'hard';
  places: Place[];
  tags: string[];
}

export interface CollectionItem {
  id: string;
  placeId: string;
  name: string;
  category: string;
  scannedAt: Date;
  photo?: string;
}

export interface UserStats {
  totalScanned: number;
  routesCompleted: number;
  distanceWalked: number;
  achievements: Achievement[];
  coupons: Coupon[];
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: Date;
  progress: number;
  maxProgress: number;
}

export interface Coupon {
  id: string;
  businessName: string;
  discount: number;
  description: string;
  validUntil: Date;
  qrCode: string;
  isUsed: boolean;
  promoCode?: string; // для промокодов вместо скидок
}

export interface TabCategory {
  id: string;
  name: string;
  icon: string;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  businessName: string;
  businessId: string;
  type: 'visit' | 'route' | 'scan' | 'social' | 'route_with_geo';
  requirements: {
    placesToVisit?: string[];
    placesToScan?: string[];
    minDistance?: number;
    socialAction?: string;
    routeToComplete?: string;
    requireGeolocation?: boolean;
    minAccuracy?: number;
  };
  rewards: {
    points: number;
    coupon?: Coupon;
    badge?: string;
  };
  validUntil: Date;
  isActive: boolean;
  completedBy?: string[];
  // Новые поля для расширенной функциональности
  isPush?: boolean;
  urgency?: 'low' | 'medium' | 'high';
  requiresGeolocation?: boolean;
  difficulty?: 'easy' | 'medium' | 'hard';
  estimatedDuration?: number; // в минутах
}

export interface UserLevel {
  level: number;
  name: string;
  minPoints: number;
  maxPoints: number;
  privileges: string[];
  badge: string;
  color: string;
  icon: string;
}

export interface LeaderboardEntry {
  userId: string;
  username: string;
  points: number;
  level: UserLevel;
  achievements: number;
  completedQuests: number;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  location: {
    name: string;
    coordinates: [number, number];
  };
  startDate: Date;
  endDate: Date;
  category: 'culture' | 'food' | 'entertainment' | 'sport' | 'education';
  organizer: string;
  price?: number;
  maxParticipants?: number;
  currentParticipants: number;
  images: string[];
  isActive: boolean;
}
