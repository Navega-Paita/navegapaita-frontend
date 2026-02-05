// src/shared/models/operation.model.ts
import type { User } from "./user.model.ts";
import type { Vessel} from "./vessel.model.ts";

export const OperationStatus = {
    PENDING: 'PENDING',
    REQUESTED: 'REQUESTED',
    CONFIRMED: 'CONFIRMED',
    REJECTED: 'REJECTED',
    IN_PROGRESS: 'IN_PROGRESS',
    COMPLETED: 'COMPLETED',
} as const;

export type OperationStatusType = typeof OperationStatus[keyof typeof OperationStatus];

export interface Operation {
    id: number;
    tourName: string;
    status: OperationStatusType; // Usamos el tipo derivado
    rejectionReason?: string | null;
    dateTime: string;
    fisherman?: User | null; // Cambiado any por User
    vessel?: Vessel | null;   // Cambiado any por Vessel
}