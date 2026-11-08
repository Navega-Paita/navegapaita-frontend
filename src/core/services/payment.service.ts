// src/features/payments/services/payment.service.ts
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Solo QUÉ se quiere reservar: el precio, el título y la referencia los calcula el backend
export interface CreatePreferencePayload {
    userId: number;
    packageId: number;
    availabilityId: number;
    quantity: number;
}

export const paymentService = {
    createPreference: async (payload: CreatePreferencePayload) => {
        const response = await fetch(`${API_URL}/payments/create-preference`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(error.message || 'No se pudo crear la preferencia de pago');
        }

        return await response.json();
    },

    // Historial de reservas del usuario (los pagos los registra el webhook del backend)
    getUserReservations: async (userId: number | string) => {
        const response = await fetch(`${API_URL}/payments/user/${userId}`);

        if (!response.ok) {
            throw new Error('No se pudo obtener el historial de reservaciones.');
        }

        return await response.json();
    },
};