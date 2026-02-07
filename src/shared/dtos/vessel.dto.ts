import type { CloudinaryImage } from "../models/cloudinary.model.ts";

export interface CreateVesselDto {
    name: string;
    registrationNumber: string;
    type: string;
    capacity: number;
    technicalSpecs?: string;
    ownerId: number;
    image?: CloudinaryImage;
}