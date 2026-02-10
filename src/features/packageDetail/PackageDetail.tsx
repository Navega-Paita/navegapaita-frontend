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
    Chip
} from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import {useEffect, useState} from "react";
import { mockPackage} from "./mocks/mock.ts";
import Gallery from "./components/Gallery";
import ItinerarySection from "./components/ItinerarySection";
import DatesPricesSection from "./components/DatesPricesSection";
import InclusionsSection from "./components/InclusionsSection.tsx";
import "./PackageDetail.css";


export default function PackageDetail() {
    const { slug } = useParams();
    const packageData = mockPackage; // luego vendrá del backend por slug
    const [tab, setTab] = useState(0);
    const [wishlist, setWishlist] = useState(false);
    const handleTabClick = (sectionId: string) => {
        const el = document.getElementById(sectionId);
        if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    };
    const [activeTab, setActiveTab] = useState(0);

    useEffect(() => {
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
    }, []);


    return (
        <Container className="package-detail">
            {/* Breadcrumb */}
            <Breadcrumbs className="breadcrumb">
                <Link href="/">Home</Link>
                <Link href="/buscar">Buscar</Link>
                <Typography color="text.primary">{packageData.title}</Typography>
            </Breadcrumbs>

            {/* Header */}
            <Box className="package-header">
                <Typography variant="h4">{packageData.title}</Typography>
                <IconButton onClick={() => setWishlist(!wishlist)}>
                    {wishlist ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
                </IconButton>
            </Box>

            <div className="package-detail-layout">
                <div className="package-main">
                    <Gallery images={packageData.imageGallery} />
                </div>

                <div className="package-sidebar">
                    <Box className="price-card">
                        <Typography className="price-label">Desde</Typography>

                        <Box className="price-row">
                            <Typography className="price-final">USD {mockPackage.price}</Typography>
                            <Typography className="price-original">
                                USD {Math.round(mockPackage.price / (1 - mockPackage.discount / 100))}
                            </Typography>
                        </Box>

                        <Chip
                            label={`-${mockPackage.discount}% OFF`}
                            color="error"
                            size="small"
                            className="discount-chip"
                        />

                        <Divider sx={{ my: 2 }} />

                        <Box className="price-info">
                            <Typography><strong>Duración:</strong> {mockPackage.duration}</Typography>
                            <Typography><strong>Destinos:</strong> {mockPackage.destinations.join(", ")}</Typography>
                            <Typography><strong>Edad mínima:</strong> {mockPackage.minAge} años</Typography>
                            <Typography><strong>Grupo:</strong> máx. {mockPackage.groupSize} personas</Typography>
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
