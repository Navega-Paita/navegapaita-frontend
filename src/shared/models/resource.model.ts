// En shared/models/resource.model.ts (o similar)
export interface ResourceUpdatePayload {
    type: 'FISHERMAN' | 'VESSEL';
    id: number;
    status: string;
    userId?: number; // Por si usas el ID de usuario en lugar del perfil
}