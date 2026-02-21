import {useState, useRef, type SyntheticEvent} from 'react';
import {
    Box,
    Container,
    Typography,
    Tabs,
    Tab,
    Button,
    IconButton
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
import type { Experience } from "../../shared/models/experience";
import {useNavigate} from "react-router-dom";


const EXPERIENCES: Record<string, Experience[]> = {
    unique: [
        { id: '1', title: 'Paseo en bote tradicional por la bahía', duration: '4 horas', isFavorite: false, price: 45, originalPrice: 60, image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop', tag: 'Popular' },
        { id: '2', title: 'Taller de elaboración de ceviche', duration: '3 horas', isFavorite: false, price: 35, image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400&h=300&fit=crop' },
        { id: '3', title: 'Tour artesanal con pescadores locales', duration: '5 horas', isFavorite: false, price: 55, image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop' },
        { id: '4', title: 'Experiencia gastronómica frente al mar', duration: '2.5 horas', isFavorite: false, price: 40, image: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=400&h=300&fit=crop' },
        { id: '5', title: 'Pesca artesanal al amanecer', duration: '6 horas', price: 65, isFavorite: false, originalPrice: 80, image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop' },
    ],
    new: [
        { id: '11', title: 'Experiencia de buceo en arrecifes', duration: '5 horas', isFavorite: false, price: 85, image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop', tag: 'Nuevo' },
        { id: '12', title: 'Taller de nudos marineros', duration: '2 horas', isFavorite: false, price: 25, image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=400&h=300&fit=crop', tag: 'Nuevo' },
    ],
    popular: [
        { id: '21', title: 'Full day: Playas del norte', duration: '8 horas', isFavorite: false, price: 78, originalPrice: 95, image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=300&fit=crop', tag: 'Bestseller' },
    ],
    marine: [
        { id: '31', title: 'Observación de delfines', duration: '5 horas', isFavorite: false, price: 72, image: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=400&h=300&fit=crop' },
    ]
};

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
    experiences: Experience[];
}

export function ExperienceCarousel({ experiences }: ExperienceCarouselProps){
    const carouselRef = useRef<HTMLDivElement | null>(null);

    // Tipamos la dirección como una unión de strings literales para mayor seguridad
    const scroll = (direction: 'left' | 'right'): void => {
        if (carouselRef.current) {
            const scrollAmount = direction === 'left' ? -300 : 300;
            carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    return (
        <Box className="carousel-container" sx={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            {/* Botón Izquierdo */}
            <IconButton
                className="carousel-nav-button left"
                onClick={() => scroll('left')}
                aria-label="Anterior"
                sx={{ position: 'absolute', left: -20, zIndex: 2, bgcolor: 'background.paper', boxShadow: 2 }}
            >
                <ChevronLeftIcon />
            </IconButton>

            {/* El wrapper que contiene los items */}
            <Box
                className="carousel-wrapper"
                ref={carouselRef}
                sx={{
                    display: 'flex',
                    overflowX: 'auto',
                    scrollBehavior: 'smooth',
                    gap: 2,
                    p: 2,
                    '&::-webkit-scrollbar': { display: 'none' }, // Oculta scrollbar en Chrome/Safari
                    msOverflowStyle: 'none', // Oculta en IE/Edge
                    scrollbarWidth: 'none'   // Oculta en Firefox
                }}
            >
                {experiences.map((experience) => (
                    <Box key={experience.id} className="carousel-item" sx={{ minWidth: { xs: '280px', md: '320px' } }}>
                        <ExperienceCard experience={experience} />
                    </Box>
                ))}
            </Box>

            {/* Botón Derecho */}
            <IconButton
                className="carousel-nav-button right"
                onClick={() => scroll('right')}
                aria-label="Siguiente"
                sx={{ position: 'absolute', right: -20, zIndex: 2, bgcolor: 'background.paper', boxShadow: 2 }}
            >
                <ChevronRightIcon />
            </IconButton>
        </Box>
    );
}

export default function HomePage() {
    const [selectedTab, setSelectedTab] = useState<number>(0);
    const navigate = useNavigate();

    // Tipamos el cambio de tab siguiendo la firma de Material UI
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

    // Mapeo de tabs a secciones de experiencias
    const tabExperiences = [
        EXPERIENCES.unique,
        EXPERIENCES.new,
        EXPERIENCES.popular
    ];

    const currentExperiences = tabExperiences[selectedTab];

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

                {/* Carrusel de experiencias */}
                <ExperienceCarousel experiences={currentExperiences} />

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

            {/* Section: Experiencias Marinas */}
            <Container maxWidth="lg" sx={{ mb: 8 }}>

                <Box className="tabs-container">
                    <Typography className="section-title">
                        <b>Experiencias Marinas</b>
                    </Typography>
                    <Box className="explore-button-container">
                        <Button
                            onClick={() => handleExploreExperienceClick("bote")}
                            variant="outlined"
                            sx={{
                                borderRadius: '30px',
                                padding: '8px 24px',
                                textTransform: 'none',
                                fontSize: '14px',
                                fontWeight: 600,
                                borderColor: 'text.primary',
                                color: 'text.primary',
                                '&:hover': {
                                    borderColor: 'text.primary',
                                    backgroundColor: 'rgba(0,0,0,0.04)'
                                }
                            }}
                        >
                            Explorar experiencias marinas
                        </Button>
                    </Box>

                </Box>

                <ExperienceCarousel experiences={EXPERIENCES.marine} />

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
                        Explorar experiencias marinas
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