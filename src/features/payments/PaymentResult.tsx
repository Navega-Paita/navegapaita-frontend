import React from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

export default function PaymentResult() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const status = searchParams.get('status') || searchParams.get('collection_status');
    const paymentId = searchParams.get('payment_id') || searchParams.get('collection_id');
    const preferenceId = searchParams.get('preference_id');
    const paymentType = searchParams.get('payment_type');
    const statusDetail = searchParams.get('status_detail');

    const isApproved = status === 'approved' || status === 'success';
    const isPending = status === 'pending' || status === 'in_process';

    const getMessageByDetail = (detail: string | null) => {
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
                if (isApproved) {
                    return {
                        title: '¡Pago Aprobado con Éxito!',
                        desc: 'Tu reserva turística ha sido procesada y confirmada automáticamente.',
                        color: '#16a34a',
                        bgIcon: '#dcfce7',
                    };
                }
                if (isPending) {
                    return {
                        title: 'Pago en Proceso',
                        desc: 'Estamos esperando la confirmación de tu pago. Se actualizará automáticamente en tus reservaciones.',
                        color: '#d97706',
                        bgIcon: '#fef3c7',
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

    const uiContent = getMessageByDetail(statusDetail);

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
                    ) : isPending ? (
                        <svg style={{ height: '36px', width: '36px', color: uiContent.color }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
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

                {/* Botones de acción dinámicos */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <button
                        onClick={() => {
                            if (isApproved || isPending) {
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
                        {isApproved || isPending ? 'Ver Mis Reservaciones' : 'Intentar nuevamente'}
                    </button>

                    {(isApproved || isPending) && (
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