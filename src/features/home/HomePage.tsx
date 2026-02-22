import { useState, useRef, useEffect, type SyntheticEvent } from 'react';
import {
    Box,
    Container,
    Typography,
    Tabs,
    Tab,
    Button,
    IconButton,
    CircularProgress
} from '@mui/material';
import Grid from '@mui/material/Grid';

import {
    ChevronLeft as ChevronLeftIcon,
    ChevronRight as ChevronRightIcon
} from '@mui/icons-material';
import SearchBar from '../../shared/components/SearchBar/SearchBar.tsx';
import HeroCarousel from '../../shared/components/HeroCarousel/HeroCarousel.tsx';
import ExperienceCard from '../../shared/components/ExperienceCard/ExperienceCard.tsx';
import './HomePage.css';
import { useNavigate } from "react-router-dom";
import { packageService} from "../../core/services/package.service.ts";
import type { PackageCardDto} from "../../shared/dtos/package-card.dto.ts";

interface Feature {
    icon: string;
    title: string;
    description: string;
}

const FEATURES: Feature[] = [
    { icon: '🎯', title: 'Expertos en grupos pequeños', description: 'Somos especialistas en viajes face to face con grupos íntimos.' },
    { icon: '🌟', title: 'Experiencias inmersivas', description: 'Licencia auténtica para experiencias locales genuinas.' },
    { icon: '👥', title: 'Líderes locales', description: 'Guías apasionados y con experiencia local.' },
    { icon: '✈️', title: 'Viajeros con ideas afines', description: 'Conéctate con una comunidad de exploradores curiosos.' }
];

interface ExperienceCarouselProps {
    experiences: PackageCardDto[];
}

export function ExperienceCarousel({ experiences }: ExperienceCarouselProps) {
    const carouselRef = useRef<HTMLDivElement | null>(null);

    const scroll = (direction: 'left' | 'right'): void => {
        if (carouselRef.current) {
            const scrollAmount = direction === 'left' ? -300 : 300;
            carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    if (experiences.length === 0) {
        return (
            <Box sx={{ py: 4, textAlign: 'center' }}>
                <Typography color="text.secondary">No hay experiencias disponibles en esta categoría.</Typography>
            </Box>
        );
    }

    return (
        <Box className="carousel-container" sx={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <IconButton
                className="carousel-nav-button left"
                onClick={() => scroll('left')}
                sx={{ position: 'absolute', left: -20, zIndex: 2, bgcolor: 'background.paper', boxShadow: 2 }}
            >
                <ChevronLeftIcon />
            </IconButton>

            <Box
                className="carousel-wrapper"
                ref={carouselRef}
                sx={{
                    display: 'flex',
                    overflowX: 'auto',
                    scrollBehavior: 'smooth',
                    gap: 2,
                    p: 2,
                    '&::-webkit-scrollbar': { display: 'none' },
                    msOverflowStyle: 'none',
                    scrollbarWidth: 'none'
                }}
            >
                {experiences.map((pkg) => (
                    <Box key={pkg.id} sx={{ minWidth: { xs: '280px', md: '320px' } }}>
                        {/* Pasamos el DTO al componente Card */}
                        <ExperienceCard experience={pkg} />
                    </Box>
                ))}
            </Box>

            <IconButton
                className="carousel-nav-button right"
                onClick={() => scroll('right')}
                sx={{ position: 'absolute', right: -20, zIndex: 2, bgcolor: 'background.paper', boxShadow: 2 }}
            >
                <ChevronRightIcon />
            </IconButton>
        </Box>
    );
}

export default function HomePage() {
    const [selectedTab, setSelectedTab] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);
    const [data, setData] = useState<{
        uniqueExperiences: PackageCardDto[];
        newExperiences: PackageCardDto[];
        popularExperiences: PackageCardDto[];
    }>({
        uniqueExperiences: [],
        newExperiences: [],
        popularExperiences: []
    });

    const navigate = useNavigate();

    // Carga de datos real del backend
    useEffect(() => {
        const fetchHomeData = async () => {
            try {
                setLoading(true);
                // Si tienes el ID del usuario en un state global o localstorage, pásalo aquí
                const userIdStr = localStorage.getItem('userId');
                const userId = userIdStr ? parseInt(userIdStr) : undefined;

                const response = await packageService.getHomePackages(userId);
                setData(response);
            } catch (error) {
                console.error("Error cargando el Home:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchHomeData();
    }, []);

    const handleTabChange = (_event: SyntheticEvent, newValue: number): void => {
        setSelectedTab(newValue);
    };

    const handleExploreExperienceClick = (searchValue: string) => {
        const params = new URLSearchParams();
        params.set('page', '1');
        if (searchValue && searchValue.trim() !== "") {
            params.set('keyword', searchValue.trim());
        }
        navigate({
            pathname: '/buscar',
            search: `?${params.toString()}`
        });
    };

    // Mapeo dinámico de las listas que vienen del backend
    const getActiveList = (): PackageCardDto[] => {
        switch (selectedTab) {
            case 0: return data.uniqueExperiences;
            case 1: return data.newExperiences;
            case 2: return data.popularExperiences;
            default: return [];
        }
    };

    return (
        <Box>
            {/* Hero Section con búsqueda */}
            <Box className="hero-section">
                <Container maxWidth="lg">
                    <Box sx={{ mb: 4 }}>
                        <SearchBar />
                    </Box>
                    <HeroCarousel />
                </Container>
            </Box>

            {/* Section: Experiencias auténticas y destacadas */}
            <Container maxWidth="lg" sx={{ mb: 8 }} className="custom-container">
                <Box className="title-section">
                    <Typography className="main-title">
                        Experiencias auténticas y notables en grupos pequeños en todo Paita
                    </Typography>
                </Box>

                {/* Stats */}
                <Grid container spacing={4} className="stats-container">
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Box className="stat-item">
                            <Typography className="stat-text">Miles de experiencias,</Typography>
                            <Typography className="stat-text">en más de 100 países</Typography>
                        </Box>
                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }}>
                        <Box className="stat-item">
                            <Typography className="stat-text">Aventuras compartidas con</Typography>
                            <Typography className="stat-text">personas de ideas afines</Typography>
                        </Box>
                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }}>
                        <Box className="stat-item">
                            <Typography className="stat-text">Creando cambio positivo</Typography>
                            <Typography className="stat-text">desde 1989</Typography>
                        </Box>
                    </Grid>
                </Grid>


                {/* Tabs de categorías con botón Explorar */}
                <Box className="tabs-container">
                    <Tabs
                        value={selectedTab}
                        onChange={handleTabChange}
                        variant="scrollable" // Permite el scroll horizontal
                        scrollButtons="auto" // Muestra flechas si es necesario
                        allowScrollButtonsMobile
                        className="tabs-wrapper"
                        sx={{
                            '& .MuiTabs-scroller': {
                                '&::-webkit-scrollbar': { display: 'none' }, // Oculta barra de scroll estética
                                msOverflowStyle: 'none',
                                scrollbarWidth: 'none',
                            },
                            '& .MuiTab-root': {
                                textTransform: 'none',
                                fontSize: { xs: '14px', md: '16px' }, // Un poco más pequeño en móvil
                                fontWeight: 500,
                                minHeight: 48,
                                color: 'text.secondary',
                                px: { xs: 2, md: 3 },
                                whiteSpace: 'nowrap' // Evita que el texto salte de línea
                            },
                            '& .Mui-selected': {
                                color: 'text.primary',
                                fontWeight: 600
                            },
                            '& .MuiTabs-indicator': {
                                backgroundColor: '#005b9e',
                                height: 3
                            }
                        }}
                    >
                        <Tab label="Experiencias únicas" />
                        <Tab label="Nuevas experiencias" />
                        <Tab label="Experiencias populares" />
                    </Tabs>

                    <Box className="explore-button-container">
                        <Button
                            onClick={() => handleExploreExperienceClick("")}
                            variant="outlined"
                            className="btn-explorar"
                            sx={{
                                borderRadius: '30px',
                                padding: '8px 24px',
                                textTransform: 'none',
                                fontSize: '14px',
                                fontWeight: 600,
                                borderColor: 'text.primary',
                                color: 'text.primary',
                                whiteSpace: 'nowrap'
                            }}
                        >
                            Explorar experiencias
                        </Button>
                    </Box>
                </Box>

                {/* Renderizado condicional según carga */}
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <ExperienceCarousel experiences={getActiveList()} />
                )}

                <Box className="explore-button-container mobile-display">
                    <Button
                        variant="outlined"
                        className="btn-explorar"
                        sx={{
                            borderRadius: '30px',
                            padding: '8px 24px',
                            textTransform: 'none',
                            fontSize: '14px',
                            fontWeight: 600,
                            borderColor: 'text.primary',
                            color: 'text.primary',
                            whiteSpace: 'nowrap'
                        }}
                    >
                        Explorar experiencias
                    </Button>
                </Box>

            </Container>

            {/* Section: Lo que nos diferencia */}
            <Box className="features-section">
                <Container maxWidth="lg">
                    <Typography className="features-title">
                        Que nos diferencia
                    </Typography>

                    <Grid container className="features-content">
                        <Grid size={{ xs: 12, md: 6 }} className="features-text-column">
                            <Box className="features-text-container">
                                <Typography className="features-subtitle">
                                    Nos apasiona compartir la magia de Paita
                                </Typography>
                                <Typography className="features-description">
                                    Desde hace años, guiamos a viajeros por los rincones más auténticos de Piura para descubrir
                                    lo extraordinario de nuestra costa. Más que un tour, buscamos generar un impacto positivo
                                    en nuestras comunidades pesqueras y preservar la historia de nuestro puerto, brindando
                                    experiencias reales que te conectan con el corazón del norte peruano.
                                </Typography>
                                <br />
                                <Button variant="contained" className="features-button">
                                    Nuestro propósito en el puerto
                                </Button>
                            </Box>
                        </Grid>

                        {/* Contenedor de la Imagen */}
                        <Grid size={{ xs: 12, md: 6 }} className="features-image-column">
                            <Box
                                component="img"
                                src="https://www.intrepidtravel.com/v3/assets/blt0de87ff52d9c34a8/blt53abab0545bcc576/68ae983b98564f7f1cb49b39/OI_2.0-Sets_us_apart_tile-Homepage-1600x1100-Kenya.jpg?branch=prd&format=pjpg&auto=webp&width=1535"
                                alt="Travelers"
                                className="features-image"
                            />
                        </Grid>
                    </Grid>

                    {/* Bloque inferior de características */}
                    <Box className="features-grid-container">
                        <Grid container spacing={4}>
                            {FEATURES.map((feature, index) => (
                                <Grid size={{ xs: 12, sm: 6 }} key={index}>
                                    <Box className="feature-item">
                                        <Box className="feature-icon-container">
                                            {feature.icon}
                                        </Box>
                                        <Box>
                                            <Typography className="feature-item-title">
                                                {feature.title}
                                            </Typography>
                                            <Typography className="feature-item-text">
                                                {feature.description}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                </Container>
            </Box>
        </Box>
    );
}