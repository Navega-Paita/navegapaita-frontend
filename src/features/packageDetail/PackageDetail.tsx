import { useParams } from "react-router-dom";
import {
    Box,
    Container,
    Typography,
    Breadcrumbs,
    Link,
    Tabs,
    Tab,
    IconButton,
    Button,
    Divider,
    Chip,
    CircularProgress,
    Rating
} from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { useEffect, useState } from "react";
import { packageService } from "../../core/services/package.service.ts";
import { reviewsService } from "../../core/services/reviews.service.ts"; // 👈 Importamos el servicio de reseñas
import Gallery from "./components/Gallery";
import ItinerarySection from "./components/ItinerarySection";
import DatesPricesSection from "./components/DatesPricesSection";
import InclusionsSection from "./components/InclusionsSection.tsx";
import "./PackageDetail.css";
import type { PackageDetailDto } from "../../shared/dtos/package-detail.dto.ts";

export default function PackageDetail() {
    const { slug } = useParams<{ slug: string }>();
    const [packageData, setPackageData] = useState<PackageDetailDto | null>(null);
    const [loading, setLoading] = useState(true);
    const [wishlist, setWishlist] = useState(false);
    const [activeTab, setActiveTab] = useState(0);

    // 🟢 Estados para las reseñas del paquete
    const [reviewsData, setReviewsData] = useState<{ averageRating: number; totalReviews: number; reviews: any[] }>({
        averageRating: 0,
        totalReviews: 0,
        reviews: []
    });

    // 1. Carga de datos desde el Backend
    useEffect(() => {
        const fetchPackage = async () => {
            if (!slug) {
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const userIdStr = localStorage.getItem('userId');
                const userId = userIdStr ? parseInt(userIdStr) : undefined;

                const data = await packageService.getPackageBySlug(slug, userId);
                setPackageData(data);
                setWishlist(data.isFavorite);

                // 🟢 Una vez obtenido el paquete, cargamos sus reseñas usando su ID
                if (data && data.id) {
                    try {
                        const revs = await reviewsService.getByPackage(data.id);
                        setReviewsData(revs);
                    } catch (err) {
                        console.error("Error al cargar reseñas del paquete:", err);
                    }
                }
            } catch (error: any) {
                console.error("Error cargando detalles del paquete:", error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPackage();
    }, [slug]);

    // 2. Observer para el Scroll Spy (Tabs)
    useEffect(() => {
        if (loading || !packageData) return;

        const sections = [
            { id: "section-description", index: 0 },
            { id: "section-itinerary", index: 1 },
            { id: "section-inclusions", index: 2 },
            { id: "section-dates", index: 3 }
        ];

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const section = sections.find(s => s.id === entry.target.id);
                        if (section) setActiveTab(section.index);
                    }
                });
            },
            { threshold: 0.4 }
        );

        sections.forEach(s => {
            const el = document.getElementById(s.id);
            if (el) observer.observe(el);
        });

        return () => observer.disconnect();
    }, [loading, packageData]);

    const handleTabClick = (sectionId: string) => {
        const el = document.getElementById(sectionId);
        if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (!packageData) {
        return (
            <Container sx={{ py: 10, textAlign: 'center' }}>
                <Typography variant="h5">Lo sentimos, el paquete no fue encontrado.</Typography>
                <Button href="/" sx={{ mt: 2 }}>Volver al inicio</Button>
            </Container>
        );
    }

    // Cálculo correcto de precio final corregido (sin error de sintaxis)
    const hasDiscount = packageData.discount > 0;
    const finalPrice = packageData.price * (1 - packageData.discount / 100);

    return (
        <Container className="package-detail">
            {/* Breadcrumb */}
            <Breadcrumbs className="breadcrumb">
                <Link href="/" sx={{ textDecoration: 'none', color: 'inherit' }}>Home</Link>
                <Link href="/buscar" sx={{ textDecoration: 'none', color: 'inherit' }}>Buscar</Link>
                <Typography color="text.primary">{packageData.title}</Typography>
            </Breadcrumbs>

            {/* Header con Título, Estrellas y Favorito */}
            <Box style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <Typography variant="h4" sx={{ fontWeight: 700, marginBottom: '0.35rem' }}>
                        {packageData.title}
                    </Typography>

                    {/* 🟢 Indicador de estrellas promedio en la cabecera */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Rating value={reviewsData.averageRating} precision={0.5} readOnly size="small" />
                        <span style={{ fontSize: '0.9rem', fontWeight: '600', color: '#1f2937' }}>
                            {reviewsData.averageRating}
                        </span>
                        <span style={{ fontSize: '0.85rem', color: '#6b7280' }}>
                            ({reviewsData.totalReviews} {reviewsData.totalReviews === 1 ? 'reseña' : 'reseñas'})
                        </span>
                    </div>
                </div>

                <IconButton onClick={() => setWishlist(!wishlist)}>
                    {wishlist ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
                </IconButton>
            </Box>

            <div className="package-detail-layout">
                <div className="package-main" style={{ width: '100%', minWidth: 0 }}>
                    <Gallery images={packageData.imageGallery} />
                </div>

                <div className="package-sidebar">
                    <Box className="price-card">
                        <Typography className="price-label">Desde</Typography>

                        <Box className="price-row">
                            <Typography className="price-final">PEN {finalPrice.toFixed(2)}</Typography>
                            {hasDiscount && (
                                <Typography className="price-original">
                                    PEN {packageData.price}
                                </Typography>
                            )}
                        </Box>

                        {hasDiscount && (
                            <Chip
                                label={`-${packageData.discount}% OFF`}
                                color="error"
                                size="small"
                                className="discount-chip"
                            />
                        )}

                        <Divider sx={{ my: 2 }} />

                        <Box className="price-info">
                            <Typography><strong>Duración:</strong> {packageData.duration}</Typography>
                            <Typography sx={{ wordBreak: 'break-word' }}>
                                <strong>Destinos:</strong> {packageData.destinations.join(", ")}
                            </Typography>
                            <Typography><strong>Edad mínima:</strong> {packageData.minAge} años</Typography>
                            <Typography><strong>Grupo:</strong> máx. {packageData.groupSize} personas</Typography>
                        </Box>

                        <Button
                            fullWidth
                            variant="contained"
                            className="price-cta"
                            onClick={() => handleTabClick("section-dates")}
                        >
                            Ver fechas
                        </Button>
                    </Box>
                </div>
            </div>

            <br />

            {/* Tabs */}
            <Tabs
                value={activeTab}
                className="package-tabs"
                variant="scrollable"
                scrollButtons="auto"
                allowScrollButtonsMobile
                sx={{ '& .MuiTabs-scrollButtons.Mui-disabled': { opacity: 0.3 } }}
            >
                <Tab label="Descripción" onClick={() => handleTabClick("section-description")} />
                <Tab label="Itinerario" onClick={() => handleTabClick("section-itinerary")} />
                <Tab label="Inclusiones" onClick={() => handleTabClick("section-inclusions")} />
                <Tab label="Fechas y Reseñas" onClick={() => handleTabClick("section-dates")} />
            </Tabs>

            {/* Sección de Descripción */}
            <Box id="section-description" className="tab-section">
                <h2>Descripción</h2>
                <br />
                <Typography>{packageData.description}</Typography>
            </Box>

            {/* Sección de Itinerario */}
            <Box id="section-itinerary" className="tab-section">
                <h2>Itinerario</h2>
                <ItinerarySection itinerary={packageData.itinerary} />
            </Box>

            {/* Sección de Inclusiones */}
            <Box id="section-inclusions" className="tab-section">
                <h2>Inclusiones y actividades</h2>
                <br />
                <InclusionsSection packageData={packageData} />
            </Box>

            {/* Sección de Fechas y Reseñas */}
            <Box id="section-dates" className="tab-section">
                <h2>Fechas disponibles</h2>
                <DatesPricesSection
                    dates={packageData.availability}
                    packageId={packageData.id}
                    packagePrice={packageData.price}
                    packageDiscount={packageData.discount || 0}
                    packageTitle={packageData.title}
                />

                {/* 🟢 SECCIÓN DE RESEÑAS DE LOS TURISTAS (Estilos Inline) */}
                <div style={{ marginTop: '3.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                        <div>
                            <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827', margin: 0 }}>
                                Opiniones de viajeros
                            </h3>
                            <p style={{ color: '#4b5563', fontSize: '0.9rem', margin: '0.25rem 0 0 0' }}>
                                Calificación general basada en las experiencias de nuestros clientes.
                            </p>
                        </div>

                        {/* Tarjeta resumen de rating promedio */}
                        <div style={{ backgroundColor: '#f8fafc', padding: '0.75rem 1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <span style={{ fontSize: '2rem', fontWeight: '800', color: '#2563eb' }}>
                                {reviewsData.averageRating}
                            </span>
                            <div>
                                <Rating value={reviewsData.averageRating} precision={0.5} readOnly size="small" />
                                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                                    {reviewsData.totalReviews} {reviewsData.totalReviews === 1 ? 'opinión registrada' : 'opiniones registradas'}
                                </div>
                            </div>
                        </div>
                    </div>

                    {reviewsData.reviews.length === 0 ? (
                        <div style={{ backgroundColor: '#f9fafb', padding: '2rem', borderRadius: '12px', textAlign: 'center', border: '1px solid #e5e7eb' }}>
                            <p style={{ color: '#6b7280', margin: 0, fontSize: '0.95rem' }}>
                                Este paquete aún no cuenta con reseñas. ¡Sé el primero en calificarlo al realizar tu viaje!
                            </p>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {reviewsData.reviews.map((rev) => (
                                <div
                                    key={rev.id}
                                    style={{
                                        backgroundColor: '#ffffff',
                                        borderRadius: '12px',
                                        padding: '1.25rem',
                                        border: '1px solid #e5e7eb',
                                        boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
                                    }}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                        <span style={{ fontWeight: '700', color: '#1f2937', fontSize: '0.95rem' }}>
                                            {rev.user ? `${rev.user.firstName} ${rev.user.lastName}` : 'Viajero Anónimo'}
                                        </span>
                                        <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                                            {new Date(rev.createdAt).toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' })}
                                        </span>
                                    </div>

                                    <div style={{ marginBottom: '0.5rem' }}>
                                        <Rating value={rev.rating} readOnly size="small" />
                                    </div>

                                    {rev.comment && (
                                        <p style={{ color: '#4b5563', fontSize: '0.9rem', margin: 0, lineHeight: 1.5 }}>
                                            "{rev.comment}"
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </Box>
        </Container>
    );
}