import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Rating } from '@mui/material';
import { paymentService } from "../../core/services/payment.service.ts";
import { reviewsService } from "../../core/services/reviews.service.ts";

export default function MyReservationsPage() {
    const [reservations, setReservations] = useState<any[]>([]);
    const [userReviews, setUserReviews] = useState<Record<string, any>>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [selectedReservation, setSelectedReservation] = useState<any>(null);
    const [openDialog, setOpenDialog] = useState(false);

    const [openReviewDialog, setOpenReviewDialog] = useState(false);
    const [reviewTarget, setReviewTarget] = useState<any>(null);
    const [ratingValue, setRatingValue] = useState<number | null>(5);
    const [commentValue, setCommentValue] = useState('');
    const [submittingReview, setSubmittingReview] = useState(false);
    const [reviewError, setReviewError] = useState('');

    const navigate = useNavigate();
    const userId = localStorage.getItem('userId') || '1';

    const extractPackageId = (reservation: any) => {
        if (!reservation) return null;
        if (reservation.packageId) return Number(reservation.packageId);
        if (reservation.package?.id) return Number(reservation.package.id);
        if (reservation.externalReference) {
            const match = reservation.externalReference.match(/PKG_(\d+)/i);
            if (match && match[1]) return Number(match[1]);
        }
        return null;
    };

    useEffect(() => {
        async function fetchData() {
            try {
                const [reservationsData, reviewsData] = await Promise.all([
                    paymentService.getUserReservations(userId),
                    reviewsService.getByUser(Number(userId)).catch(() => [])
                ]);

                setReservations(reservationsData);

                // 🟢 Mapeamos las reseñas usando paymentId como clave única
                const reviewsMap: Record<string, any> = {};
                reviewsData.forEach((rev: any) => {
                    if (rev.paymentId) {
                        reviewsMap[rev.paymentId] = rev;
                    }
                });
                setUserReviews(reviewsMap);
            } catch (err: any) {
                console.error(err);
                setError(err.message || 'Ocurrió un error inesperado.');
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [userId]);

    const handleOpenDetails = (reservation: any, e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
        setSelectedReservation(reservation);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedReservation(null);
    };

    const handleOpenReview = (reservation: any, e: React.MouseEvent) => {
        e.stopPropagation();
        const paymentId = reservation.paymentId;
        const existingReview = userReviews[paymentId]; // 🟢 Busca reseña de esta compra exacta

        setReviewTarget(reservation);
        setRatingValue(existingReview ? existingReview.rating : 5);
        setCommentValue(existingReview ? existingReview.comment || '' : '');
        setReviewError('');
        setOpenReviewDialog(true);
    };

    const handleCloseReview = () => {
        setOpenReviewDialog(false);
        setReviewTarget(null);
    };

    const handleSubmitReview = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!ratingValue || ratingValue < 1) {
            return setReviewError('Por favor, selecciona una calificación de 1 a 5 estrellas.');
        }

        const pkgId = extractPackageId(reviewTarget);
        const paymentId = reviewTarget?.paymentId;

        if (!pkgId || !paymentId) {
            return setReviewError('No se pudo identificar el paquete o la compra de esta reserva.');
        }

        setSubmittingReview(true);
        setReviewError('');

        try {
            const saved = await reviewsService.createOrUpdate({
                userId: Number(userId),
                packageId: Number(pkgId),
                paymentId: String(paymentId),
                rating: ratingValue,
                comment: commentValue.trim() || undefined,
            });

            setUserReviews((prev) => ({
                ...prev,
                [paymentId]: { ...saved, paymentId }
            }));

            handleCloseReview();
        } catch (err: any) {
            setReviewError(err.message || 'Error al guardar tu reseña.');
        } finally {
            setSubmittingReview(false);
        }
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
                            backgroundColor: '#2563eb', color: '#ffffff', padding: '0.75rem 1.5rem',
                            borderRadius: '8px', border: 'none', fontWeight: '600', cursor: 'pointer'
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

                        // 🟢 Verificamos reseña por cada paymentId individual
                        const hasReviewed = Boolean(item.paymentId && userReviews[item.paymentId]);

                        return (
                            <div
                                key={item.id || index}
                                onClick={() => handleOpenDetails(item)}
                                style={{
                                    backgroundColor: '#ffffff', borderRadius: '16px', padding: '1.5rem',
                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.04)', border: '1px solid #e5e7eb',
                                    display: 'flex', flexDirection: 'column', gap: '1rem', cursor: 'pointer', transition: 'all 0.2s ease'
                                }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap' }}>
                                    <div>
                                        <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: '#1f2937', margin: '0 0 0.25rem 0' }}>
                                            {item.packageName}
                                        </h3>
                                        <span style={{ fontSize: '0.8rem', color: '#6b7280' }}>
                                            ID Pago: {item.paymentId} &bull; {new Date(item.createdAt).toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' })}
                                        </span>
                                    </div>

                                    <span style={{
                                        backgroundColor: item.status === 'approved' ? '#dcfce7' : '#fef3c7',
                                        color: item.status === 'approved' ? '#15803d' : '#b45309',
                                        padding: '0.3rem 0.75rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '700', textTransform: 'capitalize'
                                    }}>
                                        ● {item.status === 'approved' ? 'Aprobado' : item.status}
                                    </span>
                                </div>

                                <hr style={{ border: '0', borderTop: '1px solid #f1f5f9', margin: '0.25rem 0' }} />

                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                        {discount > 0 ? (
                                            <>
                                                <span style={{ textDecoration: 'line-through', color: '#9ca3af', fontSize: '0.85rem' }}>
                                                    S/ {originalPrice.toFixed(2)}
                                                </span>
                                                <span style={{ fontWeight: '800', color: '#2563eb', fontSize: '1.05rem' }}>
                                                    S/ {finalPrice.toFixed(2)} <span style={{ fontSize: '0.8rem', color: '#16a34a' }}>(-{discount}%)</span>
                                                </span>
                                            </>
                                        ) : (
                                            <span style={{ fontWeight: '800', color: '#111827', fontSize: '1.05rem' }}>
                                                S/ {originalPrice.toFixed(2)}
                                            </span>
                                        )}
                                    </div>

                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                        <button
                                            onClick={(e) => handleOpenDetails(item, e)}
                                            style={{
                                                backgroundColor: 'transparent', color: '#4b5563', border: 'none',
                                                padding: '0.4rem 0.6rem', fontSize: '0.85rem', fontWeight: '600', cursor: 'pointer'
                                            }}
                                        >
                                            Ver detalles &rarr;
                                        </button>

                                        {item.status === 'approved' && (
                                            <button
                                                onClick={(e) => handleOpenReview(item, e)}
                                                style={{
                                                    backgroundColor: hasReviewed ? '#eff6ff' : '#2563eb',
                                                    color: hasReviewed ? '#1d4ed8' : '#ffffff',
                                                    border: hasReviewed ? '1px solid #bfdbfe' : 'none',
                                                    padding: '0.45rem 1rem', borderRadius: '8px', fontSize: '0.85rem', fontWeight: '600', cursor: 'pointer'
                                                }}
                                            >
                                                {hasReviewed ? '★ Editar reseña' : '★ Calificar experiencia'}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* MODAL DE VALORACIÓN */}
            {openReviewDialog && reviewTarget && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)', backdropFilter: 'blur(4px)',
                    display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1001, padding: '1rem'
                }}>
                    <form
                        onSubmit={handleSubmitReview}
                        style={{
                            backgroundColor: '#ffffff', borderRadius: '16px', maxWidth: '460px', width: '100%', padding: '2rem',
                            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
                        }}
                    >
                        <h2 style={{ fontSize: '1.35rem', fontWeight: 'bold', color: '#111827', marginBottom: '0.35rem' }}>
                            Califica tu experiencia
                        </h2>
                        <p style={{ fontSize: '0.9rem', color: '#2563eb', fontWeight: '600', marginBottom: '1.25rem' }}>
                            {reviewTarget.packageName} <span style={{ color: '#6b7280', fontWeight: 'normal', fontSize: '0.8rem' }}>(Pago: {reviewTarget.paymentId})</span>
                        </p>

                        {reviewError && (
                            <div style={{ backgroundColor: '#fee2e2', color: '#dc2626', padding: '0.75rem', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '1rem' }}>
                                {reviewError}
                            </div>
                        )}

                        <div style={{ marginBottom: '1.25rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                            <span style={{ fontSize: '0.9rem', color: '#4b5563', fontWeight: '500' }}>
                                ¿Qué te pareció este viaje?
                            </span>
                            <Rating
                                name="tour-rating"
                                value={ratingValue}
                                size="large"
                                onChange={(_, newValue) => setRatingValue(newValue)}
                            />
                        </div>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
                                Tu reseña (opcional)
                            </label>
                            <textarea
                                rows={4}
                                value={commentValue}
                                onChange={(e) => setCommentValue(e.target.value)}
                                placeholder="Cuéntanos cómo estuvo esta salida en específico..."
                                style={{
                                    width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1',
                                    fontSize: '0.9rem', resize: 'vertical', fontFamily: 'inherit', boxSizing: 'border-box'
                                }}
                            />
                        </div>

                        <div style={{ display: 'flex', gap: '0.75rem' }}>
                            <button
                                type="button"
                                onClick={handleCloseReview}
                                disabled={submittingReview}
                                style={{
                                    flex: 1, backgroundColor: '#f1f5f9', color: '#334155', border: 'none',
                                    padding: '0.7rem', borderRadius: '8px', fontWeight: '600', cursor: 'pointer'
                                }}
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={submittingReview}
                                style={{
                                    flex: 1, backgroundColor: '#2563eb', color: '#ffffff', border: 'none',
                                    padding: '0.7rem', borderRadius: '8px', fontWeight: '600',
                                    cursor: submittingReview ? 'not-allowed' : 'pointer', opacity: submittingReview ? 0.7 : 1
                                }}
                            >
                                {submittingReview ? 'Guardando...' : 'Enviar Reseña'}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}