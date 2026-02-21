import { useState, type MouseEvent } from 'react';
import { Box, Button, IconButton, Typography } from '@mui/material';
import { ChevronLeft as ChevronLeftIcon, ChevronRight as ChevronRightIcon } from '@mui/icons-material';
import './HeroCarousel.css';
import banner1 from '../../../assets/imgs/banner-1.png';
import banner2 from '../../../assets/imgs/banner-2.png';
import banner3 from '../../../assets/imgs/banner-3.png';

// 1. Definimos el modelo del Slide
interface HeroSlide {
    id: number;
    title: string;
    subtitle: string;
    image: string;
    badge: {
        text: string;
        subtext: string;
    };
}

// 2. Tipamos la constante con el modelo
const HERO_SLIDES: HeroSlide[] = [
    {
        id: 1,
        title: 'Vive Paita a través de sus pescadores',
        subtitle: 'Descubre la esencia del puerto más histórico del Perú',
        image: banner1,
        badge: { text: 'Puerto Histórico', subtext: 'Tradición y Mar' }
    },
    {
        id: 2,
        title: 'Aventuras en Paita',
        subtitle: 'Explora caletas escondidas y playas de ensueño',
        image: banner2,
        badge: { text: 'Verano 2026', subtext: 'Paita te espera' }
    },
    {
        id: 3,
        title: 'Gastronomía y Tradición',
        subtitle: 'Saborea el mar en cada experiencia compartida',
        image: banner3,
        badge: { text: '100% Auténtico', subtext: 'Manos locales' }
    }
];

export default function HeroCarousel() {
    const [currentSlide, setCurrentSlide] = useState<number>(0);

    // Tipamos el evento como MouseEvent de React para poder usar stopPropagation
    const handlePrevSlide = (e: MouseEvent<HTMLButtonElement>): void => {
        e.stopPropagation();
        setCurrentSlide((prev) => (prev === 0 ? HERO_SLIDES.length - 1 : prev - 1));
    };

    const handleNextSlide = (e: MouseEvent<HTMLButtonElement>): void => {
        e.stopPropagation();
        setCurrentSlide((prev) => (prev === HERO_SLIDES.length - 1 ? 0 : prev + 1));
    };

    const slide = HERO_SLIDES[currentSlide];

    return (
        <Box
            className="hero-container"
            sx={{ backgroundImage: `url(${slide.image})` }} // Movido de style a sx por consistencia
        >
            <div className="hero-overlay" />

            {/* Contenido del slide */}
            <Box className="hero-content">
                <Typography variant="h2" className="hero-title" sx={{
                    color: 'white',
                    fontWeight: 800,
                    fontSize: { xs: '36px', md: '56px' },
                    mb: 4,
                    lineHeight: 1.2
                }}>
                    {slide.title}
                </Typography>
                <Button
                    variant="contained"
                    sx={{
                        backgroundColor: 'white',
                        color: '#005b9e',
                        borderRadius: '8px',
                        px: 4,
                        py: 1.5,
                        textTransform: 'none',
                        fontWeight: 700,
                    }}
                >
                    {slide.subtitle}
                </Button>
            </Box>

            {/* Navegación */}
            <IconButton
                onClick={handlePrevSlide}
                className="nav-button"
                sx={{ position: 'absolute', left: 16, bgcolor: 'rgba(255,255,255,0.8)', '&:hover': { bgcolor: '#fff' } }}
            >
                <ChevronLeftIcon />
            </IconButton>

            <IconButton
                onClick={handleNextSlide}
                className="nav-button"
                sx={{ position: 'absolute', right: 16, bgcolor: 'rgba(255,255,255,0.8)', '&:hover': { bgcolor: '#fff' } }}
            >
                <ChevronRightIcon />
            </IconButton>

            {/* Indicadores */}
            <Box sx={{ position: 'absolute', bottom: 20, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 1, zIndex: 10 }}>
                {HERO_SLIDES.map((_, index: number) => (
                    <Box
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        sx={{
                            width: currentSlide === index ? 24 : 8,
                            height: 8,
                            bgcolor: currentSlide === index ? 'white' : 'rgba(255,255,255,0.5)',
                            borderRadius: 4,
                            cursor: 'pointer',
                            transition: '0.3s'
                        }}
                    />
                ))}
            </Box>
        </Box>
    );
}