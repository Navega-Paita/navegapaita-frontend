import type { CloudinaryImage } from "../models/cloudinary.model.ts";

export interface CreatePackageDto {
    title: string;
    slug: string;
    description: string;
    imageGallery: CloudinaryImage[]; // Aquí guardaremos los resultados de Cloudinary
    duration?: string;
    priceFrom?: { amount: number; discountPercentage: number };
}