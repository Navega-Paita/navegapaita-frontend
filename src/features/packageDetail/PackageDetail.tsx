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
    CircularProgress
} from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { useEffect, useState } from "react";
import { packageService } from "../../core/services/package.service.ts";
import Gallery from "./components/Gallery";
import ItinerarySection from "./components/ItinerarySection";
import DatesPricesSection from "./components/DatesPricesSection";
import InclusionsSection from "./components/InclusionsSection.tsx";
import "./PackageDetail.css";
import type {PackageDetailDto} from "../../shared/dtos/package-detail.dto.ts";

export default function PackageDetail() {
    const { slug } = useParams<{ slug: string }>();
    const [packageData, setPackageData] = useState<PackageDetailDto | null>(null);
    const [loading, setLoading] = useState(true);
    const [wishlist, setWishlist] = useState(false);
    const [activeTab, setActiveTab] = useState(0);

    // 1. Carga de datos desde el Backend
    useEffect(() => {
        const fetchPackage = async () => {
            console.log("🔍 [PackageDetail] Iniciando fetchPackage...");
            console.log("📍 [PackageDetail] Slug capturado de la URL:", slug);

            if (!slug) {
                console.warn("⚠️ [PackageDetail] No se detectó slug en la URL");
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const userIdStr = localStorage.getItem('userId');
                const userId = userIdStr ? parseInt(userIdStr) : undefined;

                console.log(`📡 [PackageDetail] Llamando a API: /packages/${slug}${userId ? `?userId=${userId}` : ''}`);

                const data = await packageService.getPackageBySlug(slug, userId);

                console.log("✅ [PackageDetail] Data recibida del servidor:", data);

                if (!data) {
                    console.error("❌ [PackageDetail] El servidor respondió pero la data está vacía/null");
                }

                setPackageData(data);
                setWishlist(data.isFavorite);
            } catch (error: any) {
                console.error("🔥 [PackageDetail] Error capturado en el catch:", error);
                console.error("📝 [PackageDetail] Mensaje de error:", error.message);
            } finally {
                setLoading(false);
                console.log("🏁 [PackageDetail] Finalizó el proceso de carga (loading = false)");
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

    // Cálculo de precio final para el sidebar (Lógica: price es el base)
    const hasDiscount = packageData.discount > 0;
    const finalPrice = Math.round(packageData.price * (1 - packageData.discount / 100));


    return (
        <Container className="package-detail">
            {/* Breadcrumb */}
            <Breadcrumbs className="breadcrumb">
                <Link href="/" sx={{ textDecoration: 'none', color: 'inherit' }}>Home</Link>
                <Link href="/buscar" sx={{ textDecoration: 'none', color: 'inherit' }}>Buscar</Link>
                <Typography color="text.primary">{packageData.title}</Typography>
            </Breadcrumbs>

            {/* Header */}
            <Box className="package-header" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>{packageData.title}</Typography>
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
                            <Typography className="price-final">USD {finalPrice}</Typography>
                            {hasDiscount && (
                                <Typography className="price-original">
                                    USD {packageData.price}
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
                            {/* Ajuste: sx para que el texto no rompa el contenedor */}
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
                        >
                            Ver fechas
                        </Button>
                    </Box>
                </div>
            </div>

            <br></br>

            {/* Tabs */}
            <Tabs
                value={activeTab}
                className="package-tabs"
                variant="scrollable" // Permite el scroll horizontal
                scrollButtons="auto" // Muestra flechas solo si es necesario
                allowScrollButtonsMobile // Obliga a que funcionen en móvil
                sx={{
                    '& .MuiTabs-scrollButtons.Mui-disabled': { opacity: 0.3 },
                }}
            >
                <Tab label="Descripción" onClick={() => handleTabClick("section-description")} />
                <Tab label="Itinerario" onClick={() => handleTabClick("section-itinerary")} />
                <Tab label="Inclusiones" onClick={() => handleTabClick("section-inclusions")} />
                <Tab label="Fechas" onClick={() => handleTabClick("section-dates")} />
            </Tabs>

            <Box id="section-description" className="tab-section">
                <h2>Descripcion</h2>
                <br></br>
                <Typography>{packageData.description}</Typography>
            </Box>

            <Box id="section-itinerary" className="tab-section">
                <h2>Itinerario</h2>
                <ItinerarySection itinerary={packageData.itinerary} />
            </Box>

            <Box id="section-inclusions" className="tab-section">
                <h2>Inclusiones y actividades</h2>
                <br></br>
                <InclusionsSection packageData={packageData} />
            </Box>

            <Box id="section-dates" className="tab-section">
                <h2>Fechas</h2>
                <DatesPricesSection dates={packageData.availability} />
            </Box>

        </Container>
    );
}
