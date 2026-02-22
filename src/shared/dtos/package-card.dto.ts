// src/packages/dto/package-card.dto.ts
export interface PackageCardDto {
    id: number;
    title: string;
    slug: string;
    mainImage: string;
    duration: string;
    price: number;
    discount: number;
    finalPrice: number;
    isFavorite: boolean;
}