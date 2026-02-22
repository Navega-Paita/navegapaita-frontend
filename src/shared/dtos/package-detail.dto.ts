// src/packages/dto/package-detail.dto.ts
export interface PackageDetailDto {
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
    imageGallery: { url: string; publicId: string }[];
    itinerary: any[]; // O tus interfaces de Itinerary
    availability: any[]; // O tus interfaces de Availability
    isFavorite: boolean;
}