import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function MyReservationsPage() {
    const [reservations, setReservations] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const userId = 5; // ID del usuario actual de prueba

    useEffect(() => {
        async function fetchUserReservations() {
            try {
                const response = await fetch(`http://localhost:3000/payments/user/${userId}`);

                if (!response.ok) {
                    throw new Error('No se pudo obtener el historial de reservaciones.');
                }

                const data = await response.json();
                setReservations(data);
            } catch (err: any) {
                console.error(err);
                setError(err.message || 'Ocurrió un error inesperado.');
            } finally {
                setLoading(false);
            }
        }

        fetchUserReservations();
    }, [userId]);

    return (
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '3rem 1rem' }}>
            <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#111827', marginBottom: '0.5rem' }}>
                    Mis Reservaciones y Compras
                </h1>
                <p style={{ color: '#4b5563', fontSize: '1rem' }}>
                    Aquí puedes ver el estado de todos los paquetes turísticos que has adquirido.
                </p>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>
                    Cargando tus reservaciones...
                </div>
            ) : error ? (
                <div style={{ backgroundColor: '#fee2e2', color: '#dc2626', padding: '1rem', borderRadius: '8px', textAlign: 'center' }}>
                    {error}
                </div>
            ) : reservations.length === 0 ? (
                <div style={{ textAlign: 'center', backgroundColor: '#f9fafb', padding: '3rem', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
                    <p style={{ color: '#4b5563', marginBottom: '1.5rem', fontSize: '1.1rem' }}>
                        Aún no tienes reservaciones registradas.
                    </p>
                    <button
                        onClick={() => navigate('/')}
                        style={{
                            backgroundColor: '#2563eb',
                            color: '#ffffff',
                            padding: '0.75rem 1.5rem',
                            borderRadius: '8px',
                            border: 'none',
                            fontWeight: '600',
                            cursor: 'pointer'
                        }}
                    >
                        Explorar Paquetes
                    </button>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {reservations.map((item, index) => (
                        <div
                            key={item.id || index}
                            style={{
                                backgroundColor: '#ffffff',
                                borderRadius: '12px',
                                padding: '1.5rem',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
                                border: '1px solid #e5e7eb',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                flexWrap: 'wrap',
                                gap: '1rem'
                            }}
                        >
                            <div>
                                {/* 🟢 Mostramos el nombre real del paquete en vez de la referencia cruda */}
                                <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '0.35rem' }}>
                                    {item.packageName}
                                </h3>
                                <p style={{ fontSize: '0.9rem', color: '#4b5563', marginBottom: '0.25rem' }}>
                                    Monto pagado: <strong>S/ {Number(item.packagePrice || 0).toFixed(2)}</strong>
                                </p>
                                <p style={{ fontSize: '0.8rem', color: '#6b7280' }}>
                                    ID de Transacción: {item.paymentId} • Fecha: {new Date(item.createdAt).toLocaleDateString()}
                                </p>
                            </div>

                            <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
                                <span style={{
                                    backgroundColor: item.status === 'approved' ? '#dcfce7' : '#fef3c7',
                                    color: item.status === 'approved' ? '#16a34a' : '#d97706',
                                    padding: '0.35rem 0.85rem',
                                    borderRadius: '20px',
                                    fontSize: '0.85rem',
                                    fontWeight: '600',
                                    textTransform: 'capitalize'
                                }}>
                                    {item.status === 'approved' ? 'Aprobado' : item.status}
                                </span>
                                <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                                    Ref: {item.preferenceId ? item.preferenceId.substring(0, 12) + '...' : 'N/A'}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}