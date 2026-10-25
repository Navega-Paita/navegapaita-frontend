import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

export default function PaymentResult() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    const status = searchParams.get('status');
    const paymentId = searchParams.get('payment_id') || searchParams.get('collection_id');
    const preferenceId = searchParams.get('preference_id');
    const paymentType = searchParams.get('payment_type');
    const statusDetail = searchParams.get('status_detail');
    const externalReference = searchParams.get('external_reference');

    useEffect(() => {
        async function confirmPaymentOnBackend() {
            if (paymentId && status === 'approved') {
                try {
                    await fetch('http://localhost:3000/payments/success', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            payment_id: paymentId,
                            status: status,
                            preference_id: preferenceId,
                            external_reference: externalReference,
                        }),
                    });
                } catch (error) {
                    console.error('Error al registrar el pago en el backend:', error);
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        }

        confirmPaymentOnBackend();
    }, [paymentId, status, preferenceId, externalReference]);

    const getMessageByDetail = (detail: string | null, currentStatus: string | null) => {
        switch (detail) {
            case 'CONT':
                return {
                    title: 'Pago Pendiente de Acreditación',
                    desc: 'Tu pago está pendiente. Te avisaremos cuando se apruebe.',
                    color: '#d97706',
                    bgIcon: '#fef3c7',
                };
            case 'FUND':
                return {
                    title: 'Fondos Insuficientes',
                    desc: 'La tarjeta utilizada no cuenta con el saldo suficiente.',
                    color: '#dc2626',
                    bgIcon: '#fee2e2',
                };
            case 'SECU':
                return {
                    title: 'Código de Seguridad Inválido',
                    desc: 'El código CVC/CVV ingresado es incorrecto.',
                    color: '#dc2626',
                    bgIcon: '#fee2e2',
                };
            case 'EXPI':
                return {
                    title: 'Tarjeta Vencida',
                    desc: 'La fecha de expiración de la tarjeta es inválida.',
                    color: '#dc2626',
                    bgIcon: '#fee2e2',
                };
            case 'CALL':
                return {
                    title: 'Pago Rechazado por el Banco',
                    desc: 'Debes comunicarte con tu entidad financiera para autorizarlo.',
                    color: '#dc2626',
                    bgIcon: '#fee2e2',
                };
            default:
                if (currentStatus === 'approved') {
                    return {
                        title: '¡Pago Aprobado con Éxito!',
                        desc: 'Tu reserva turística ha sido procesada y confirmada correctamente.',
                        color: '#16a34a',
                        bgIcon: '#dcfce7',
                    };
                }
                return {
                    title: 'Pago Rechazado o Cancelado',
                    desc: 'No pudimos procesar tu transacción. Por favor, intenta de nuevo.',
                    color: '#dc2626',
                    bgIcon: '#fee2e2',
                };
        }
    };

    const uiContent = getMessageByDetail(statusDetail, status);
    const isApproved = status === 'approved';

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '3rem 1rem',
            width: '100%'
        }}>
            <div style={{
                maxWidth: '480px',
                width: '100%',
                backgroundColor: '#ffffff',
                borderRadius: '16px',
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.08)',
                padding: '2.5rem 2rem',
                textAlign: 'center',
                border: '1px solid #f3f4f6'
            }}>
                {/* Contenedor del ícono */}
                <div style={{
                    margin: '0 auto 1.25rem auto',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '68px',
                    width: '68px',
                    borderRadius: '50%',
                    backgroundColor: uiContent.bgIcon
                }}>
                    {isApproved ? (
                        <svg style={{ height: '36px', width: '36px', color: uiContent.color }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                        </svg>
                    ) : (
                        <svg style={{ height: '36px', width: '36px', color: uiContent.color }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    )}
                </div>

                <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827', marginBottom: '0.5rem' }}>
                    {uiContent.title}
                </h1>
                <p style={{ color: '#4b5563', marginBottom: '1.5rem', fontSize: '0.95rem', lineHeight: '1.5' }}>
                    {uiContent.desc}
                </p>

                {loading && isApproved ? (
                    <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '1.5rem' }}>Sincronizando pago con el sistema...</p>
                ) : (
                    <div style={{
                        backgroundColor: '#f9fafb',
                        borderRadius: '10px',
                        padding: '1.25rem',
                        textAlign: 'left',
                        fontSize: '0.875rem',
                        color: '#374151',
                        marginBottom: '1.75rem',
                        border: '1px solid #e5e7eb',
                        lineHeight: '1.7'
                    }}>
                        <p><strong>ID de Pago:</strong> {paymentId || 'N/A'}</p>
                        <p><strong>Estado:</strong> <span style={{ color: uiContent.color, fontWeight: '600' }}>{status || 'Desconocido'}</span></p>
                        {statusDetail && <p><strong>Detalle:</strong> {statusDetail}</p>}
                        <p><strong>Medio de Pago:</strong> {paymentType || 'Tarjeta / Otro'}</p>
                        <p><strong>Preference ID:</strong> {preferenceId || 'N/A'}</p>
                    </div>
                )}

                {/* Botones de acción dinámicos */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <button
                        onClick={() => {
                            if (isApproved) {
                                navigate('/mis-reservaciones');
                            } else {
                                navigate(-1);
                            }
                        }}
                        style={{
                            width: '100%',
                            backgroundColor: isApproved ? '#2563eb' : '#4b5563',
                            color: '#ffffff',
                            padding: '0.875rem 1rem',
                            borderRadius: '8px',
                            border: 'none',
                            fontWeight: '600',
                            fontSize: '0.95rem',
                            cursor: 'pointer',
                            boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.2)',
                            transition: 'background-color 0.2s'
                        }}
                    >
                        {isApproved ? 'Ver Mis Reservaciones' : 'Intentar nuevamente'}
                    </button>

                    {isApproved && (
                        <button
                            onClick={() => navigate('/')}
                            style={{
                                width: '100%',
                                backgroundColor: 'transparent',
                                color: '#4b5563',
                                padding: '0.75rem 1rem',
                                borderRadius: '8px',
                                border: '1px solid #d1d5db',
                                fontWeight: '600',
                                fontSize: '0.9rem',
                                cursor: 'pointer',
                                transition: 'background-color 0.2s'
                            }}
                        >
                            Volver al Inicio
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}