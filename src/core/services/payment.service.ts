// src/features/payments/services/payment.service.ts
const API_URL = 'http://localhost:3000';

export const paymentService = {
    createPreference: async (userId: number, packageData: { id: number; name: string; price: number; quantity?: number }) => {
        const response = await fetch(`${API_URL}/payments/create-preference`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // Si usas token JWT para proteger tus rutas, añádelo aquí:
                // 'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
                userId: userId, // 🟢 Mandamos el ID del usuario para armar la orden/external_reference
                id: packageData.id,
                name: packageData.name,
                price: packageData.price,
                quantity: packageData.quantity || 1,
            }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'No se pudo crear la preferencia de pago');
        }

        return await response.json(); // Retorna { preferenceId, initPoint }
    },
};