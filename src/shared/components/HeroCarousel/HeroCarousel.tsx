import { useState, type MouseEvent } from 'react';
import { Box, Button, IconButton, Typography } from '@mui/material';
import { ChevronLeft as ChevronLeftIcon, ChevronRight as ChevronRightIcon } from '@mui/icons-material';
import './HeroCarousel.css';

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
        title: 'Nuevas Experiencias',
        subtitle: 'Explora nuevas experiencias',
        image: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?w=1200&h=400&fit=crop',
        badge: { text: 'hasta 20% OFF', subtext: 'viajes seleccionados' }
    },
    {
        id: 2,
        title: 'Promoción Año Nuevo',
        subtitle: 'Explora viajes en oferta',
        image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1200&h=400&fit=crop',
        badge: { text: 'hasta 20% OFF', subtext: 'viajes seleccionados' }
    },
    {
        id: 3,
        title: 'Aventuras en Paita',
        subtitle: 'Explora viajes en oferta',
        image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1200&h=400&fit=crop',
        badge: { text: 'hasta 20% OFF', subtext: 'viajes seleccionados' }
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

            {/* Badge de descuento */}
            <Box className="hero-badge">
                <Typography sx={{ fontSize: '12px', fontWeight: 800, color: '#000' }}>
                    {slide.badge.text}
                </Typography>
                <Typography sx={{ fontSize: '24px', fontWeight: 900, color: '#000', lineHeight: 1 }}>
                    20%
                </Typography>
                <Typography sx={{
                    fontSize: '9px',
                    fontWeight: 700,
                    color: '#fff',
                    bgcolor: '#000',
                    px: 1,
                    borderRadius: '4px',
                    mt: 0.5
                }}>
                    {slide.badge.subtext}
                </Typography>
            </Box>

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
                        backgroundColor: '#005b9e',
                        color: 'white',
                        borderRadius: '8px',
                        px: 4,
                        py: 1.5,
                        textTransform: 'none',
                        fontWeight: 700,
                        '&:hover': { backgroundColor: '#005b9e' }
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