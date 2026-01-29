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
    destinations: string[];
    imageGallery: string[];
    priceFrom: {
        amount: number;
        discountPercentage: number;
    };
    itinerary: ItineraryItem[];
    datesAndPrices: DatePriceItem[];
}

export interface ItineraryItem {
    title: string;
    description: string;
    includedActivities: string[];
    optionalActivities: string[];
}

export interface DatePriceItem {
    startDate: string; // ISO
    endDate: string;   // ISO
    spaceLeft: number;
    price: number;
    discount: number; // porcentaje
}
