// src/shared/models/user.model.ts
export type FishermanStatus = 'AVAILABLE' | 'BUSY' | 'OFFLINE';

export interface FishermanProfile {
    id: number;
    status: FishermanStatus;
    dni?: string;
    phone?: string;
    fcmToken?: string;
}

export interface User {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    fishermanProfile?: FishermanProfile;
}

