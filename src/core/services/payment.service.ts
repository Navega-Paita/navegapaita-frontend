// src/features/payments/services/payment.service.ts
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export interface CreatePreferencePayload {
    title: string;
    price: number;
    quantity: number;
    external_reference: string;
    availabilityId: number;
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

    confirmPayment: async (paymentData: { payment_id: string; status: string; preference_id: string | null; external_reference: string | null }) => {
        const response = await fetch(`${API_URL}/payments/success`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(paymentData),
        });

        if (!response.ok) {
            throw new Error('No se pudo registrar el pago en el backend');
        }

        return await response.json();
    },

    // 🟢 Nuevo método centralizado para obtener las reservaciones del usuario
    getUserReservations: async (userId: number | string) => {
        const response = await fetch(`${API_URL}/payments/user/${userId}`);

        if (!response.ok) {
            throw new Error('No se pudo obtener el historial de reservaciones.');
        }

        return await response.json();
    },
};