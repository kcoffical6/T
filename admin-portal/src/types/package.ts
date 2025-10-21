export interface Activity {
  time: string;
  description: string;
}

export interface ItineraryDay {
  day: number;
  activities: string[];
  accommodation: string;
  meals: string[];
  notes: string;
  _id: string;
  createdAt: string;
  updatedAt: string;
}

export interface Package {
  _id: string;
  title: string;
  slug: string;
  shortDesc: string;
  longDesc: string;
  itinerary: ItineraryDay[];
  minPax: number;
  maxPax: number;
  basePricePerPax: number;
  images: string[];
  region: string;
  tags: string[];
  featured: boolean;
  inclusions: string[];
  exclusions: string[];
  isActive: boolean;
  viewCount: number;
  bookingCount: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
