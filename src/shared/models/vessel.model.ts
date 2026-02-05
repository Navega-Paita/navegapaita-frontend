// src/shared/models/vessel.model.ts
export interface Vessel {
    id: number;
    name: string;
    registrationNumber: string;
    status: string;
    imageUrl?: string;
}