import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { paymentService } from "../../core/services/payment.service.ts";

export default function MyReservationsPage() {
    const [reservations, setReservations] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Estados para controlar el Modal (Dialog) de detalles
    const [selectedReservation, setSelectedReservation] = useState<any>(null);
    const [openDialog, setOpenDialog] = useState(false);

    const navigate = useNavigate();

    const userId = localStorage.getItem('userId') || '1';

    useEffect(() => {
        async function fetchUserReservations() {
            try {
                const data = await paymentService.getUserReservations(userId);
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

    const handleOpenDetails = (reservation: any, e?: React.MouseEvent) => {
        if (e) e.stopPropagation(); // Evitamos conflictos si hay otros eventos
        setSelectedReservation(reservation);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedReservation(null);
    };

    return (
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '3rem 1rem' }}>
            <div style={{ marginBottom: '2.5rem', textAlign: 'center' }}>
                <h1 style={{ fontSize: '2.25rem', fontWeight: '800', color: '#111827', marginBottom: '0.5rem' }}>
                    Mis Reservaciones y Compras
                </h1>
                <p style={{ color: '#4b5563', fontSize: '1rem' }}>
                    Visualiza el estado de tus experiencias turísticas adquiridas y consulta sus detalles.
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
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    {reservations.map((item, index) => {
                        const originalPrice = Number(item.packagePrice || 0);
                        const discount = Number(item.packageDiscount || 0);
                        const finalPrice = discount > 0 ? originalPrice * (1 - discount / 100) : originalPrice;

                        return (
                            <div
                                key={item.id || index}
                                onClick={() => handleOpenDetails(item)}
                                style={{
                                    backgroundColor: '#ffffff',
                                    borderRadius: '14px',
                                    padding: '1.5rem',
                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.04), 0 2px 4px -1px rgba(0, 0, 0, 0.02)',
                                    border: '1px solid #e5e7eb',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    flexWrap: 'wrap',
                                    gap: '1.5rem',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                    e.currentTarget.style.boxShadow = '0 10px 20px -3px rgba(0, 0, 0, 0.08)';
                                    e.currentTarget.style.borderColor = '#cbd5e1';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.04)';
                                    e.currentTarget.style.borderColor = '#e5e7eb';
                                }}
                            >
                                {/* Info principal */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', flex: 1, minWidth: '240px' }}>
                                    <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: '#1f2937', margin: 0 }}>
                                        {item.packageName}
                                    </h3>

                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', margin: '0.15rem 0' }}>
                                        {discount > 0 ? (
                                            <>
                                                <span style={{ textDecoration: 'line-through', color: '#9ca3af', fontSize: '0.85rem' }}>
                                                    S/ {originalPrice.toFixed(2)}
                                                </span>
                                                <span style={{ fontWeight: '700', color: '#2563eb', fontSize: '1rem' }}>
                                                    S/ {finalPrice.toFixed(2)} (-{discount}%)
                                                </span>
                                            </>
                                        ) : (
                                            <span style={{ fontWeight: '700', color: '#111827', fontSize: '1rem' }}>
                                                S/ {originalPrice.toFixed(2)}
                                            </span>
                                        )}
                                    </div>

                                    <span style={{ fontSize: '0.8rem', color: '#6b7280' }}>
                                        ID: {item.paymentId} &bull; {new Date(item.createdAt).toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' })}
                                    </span>
                                </div>

                                {/* Acciones y Estado (Mejora visual UX) */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                                    <span style={{
                                        backgroundColor: item.status === 'approved' ? '#dcfce7' : '#fef3c7',
                                        color: item.status === 'approved' ? '#15803d' : '#b45309',
                                        padding: '0.35rem 0.85rem',
                                        borderRadius: '20px',
                                        fontSize: '0.8rem',
                                        fontWeight: '600',
                                        textTransform: 'capitalize'
                                    }}>
                                        {item.status === 'approved' ? 'Aprobado' : item.status}
                                    </span>

                                    {/* 🟢 Botón de acción claro en lugar de texto plano */}
                                    <button
                                        onClick={(e) => handleOpenDetails(item, e)}
                                        style={{
                                            backgroundColor: '#f8fafc',
                                            color: '#334155',
                                            border: '1px solid #cbd5e1',
                                            padding: '0.45rem 1rem',
                                            borderRadius: '8px',
                                            fontSize: '0.85rem',
                                            fontWeight: '600',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.4rem',
                                            transition: 'background-color 0.2s'
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'}
                                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
                                    >
                                        Ver detalles
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* MODAL / DIALOG DE DETALLES */}
            {openDialog && selectedReservation && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100vw',
                    height: '100vh',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    backdropFilter: 'blur(4px)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 1000,
                    padding: '1rem'
                }}>
                    <div style={{
                        backgroundColor: '#ffffff',
                        borderRadius: '16px',
                        maxWidth: '480px',
                        width: '100%',
                        padding: '2rem',
                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                        position: 'relative',
                    }}>
                        <h2 style={{ fontSize: '1.35rem', fontWeight: 'bold', color: '#111827', marginBottom: '1.25rem' }}>
                            Detalles de la Reservación
                        </h2>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '1.5rem', color: '#374151', fontSize: '0.95rem' }}>
                            <p style={{ fontSize: '1.1rem', fontWeight: '700', color: '#2563eb', margin: 0 }}>
                                {selectedReservation.packageName}
                            </p>
                            <hr style={{ border: '0', borderTop: '1px solid #e5e7eb', margin: '0.2rem 0' }} />

                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: '#6b7280' }}>Estado:</span>
                                <span style={{ fontWeight: '600', textTransform: 'capitalize' }}>{selectedReservation.status}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: '#6b7280' }}>ID de Pago (MP):</span>
                                <span style={{ fontWeight: '600' }}>{selectedReservation.paymentId}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: '#6b7280' }}>Fecha de Compra:</span>
                                <span style={{ fontWeight: '600' }}>{new Date(selectedReservation.createdAt).toLocaleString()}</span>
                            </div>

                            <div style={{ backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '10px', marginTop: '0.5rem', border: '1px solid #e2e8f0' }}>
                                <p style={{ fontWeight: '700', marginBottom: '0.5rem', color: '#1e293b' }}>Resumen Financiero</p>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                                    <span>Precio del Paquete:</span>
                                    <span>S/ {Number(selectedReservation.packagePrice || 0).toFixed(2)}</span>
                                </div>
                                {selectedReservation.packageDiscount > 0 && (
                                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#16a34a', fontWeight: '600' }}>
                                        <span>Descuento aplicado:</span>
                                        <span>-{selectedReservation.packageDiscount}%</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div style={{ textAlign: 'right' }}>
                            <button
                                onClick={handleCloseDialog}
                                style={{
                                    backgroundColor: '#111827',
                                    color: '#ffffff',
                                    border: 'none',
                                    padding: '0.6rem 1.5rem',
                                    borderRadius: '8px',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    width: '100%'
                                }}
                            >
                                Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}