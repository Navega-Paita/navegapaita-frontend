import type { CloudinaryImage } from './cloudinary.model';

export interface Package {
    id: number;
    title: string;
    slug: string;
    description: string;
    duration: string;
    meals: string;
    transport: string;
    minAge: number;
    groupSize: number;
    type: string;
    price: number;
    discount: number;
    destinations: string[];
    imageGallery: CloudinaryImage[];
    itinerary: ItineraryItem[];
    availability: AvailabilityItem[];
}

export interface ItineraryItem {
    title: string;
    description: string;
    includedActivities: string[];
    optionalActivities: string[];
}

export interface AvailabilityItem {
    startDate: string; // ISO
    endDate: string;   // ISO
    spaceLeft: number;
}
