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
    actor?: User | null;
}

// 🟢 Interfaz ligera del paquete en la operación
export interface OperationPackage {
    id: number;
    title: string;
    price?: number;
    duration?: string;
}

export interface Operation {
    id: number;
    tourName: string;
    status: OperationStatusType;
    logs?: OperationLog[];
    dateTime: string;
    fisherman?: User | null;
    vessel?: Vessel | null;
    package?: OperationPackage | null; // 🟢 Añadido aquí
}