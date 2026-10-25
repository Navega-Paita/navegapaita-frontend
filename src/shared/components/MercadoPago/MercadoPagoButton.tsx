import React, { useState } from 'react';
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react';
import { paymentService} from "../../../core/services/payment.service.ts";

// Inicializamos Mercado Pago con tu Public Key de prueba desde las variables de entorno
initMercadoPago(import.meta.env.VITE_MERCADOPAGO_PUBLIC_KEY, {
    locale: 'es-PE', // Configurado para Perú
});

interface MercadoPagoButtonProps {
    packageItem: {
        id: number;
        name: string;
        price: number;
    };
}

export const MercadoPagoButton: React.FC<MercadoPagoButtonProps> = ({ packageItem }) => {
    const [preferenceId, setPreferenceId] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleCreatePreference = async () => {
        try {
            setLoading(true);

            // 1. Obtenemos el userId (de tu almacenamiento local, contexto o estado global)
            const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
            const userId = currentUser.id;

            if (!userId) {
                alert('Debes iniciar sesión para realizar una reserva.');
                return;
            }

            // 2. Llamamos a tu service ordenado en lugar de hacer un fetch directo
            const data = await paymentService.createPreference(userId, {
                id: packageItem.id,
                name: packageItem.name,
                price: packageItem.price,
            });

            if (data.preferenceId) {
                setPreferenceId(data.preferenceId);
            } else {
                alert('No se pudo generar la preferencia de pago.');
            }
        } catch (error: any) {
            console.error('Error al conectar con el backend:', error);
            alert(error.message || 'Error de conexión al procesar el pago.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ marginTop: '15px' }}>
            {!preferenceId ? (
                <button
                    onClick={handleCreatePreference}
                    disabled={loading}
                    style={{
                        backgroundColor: '#009EE3',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '12px 20px',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        width: '100%',
                        fontSize: '14px',
                    }}
                >
                    {loading ? 'Generando pasarela...' : `Pagar S/ ${packageItem.price} con Mercado Pago`}
                </button>
            ) : (
                /* Componente oficial Wallet del SDK de React que renderiza el botón de Mercado Pago usando la preferencia */
                <Wallet initialization={{ preferenceId }} />
            )}
        </div>
    );
};