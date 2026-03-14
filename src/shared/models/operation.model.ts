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

export interface OperationLog {
    id: number;
    action: string;
    reason: string | null;
    createdAt: string;
    actor?: User | null; // El pescador o usuario que generó el evento
}

export interface Operation {
    id: number;
    tourName: string;
    status: OperationStatusType; // Usamos el tipo derivado
    logs?: OperationLog[];
    dateTime: string;
    fisherman?: User | null; // Cambiado any por User
    vessel?: Vessel | null;   // Cambiado any por Vessel
}