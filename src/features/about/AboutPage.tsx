import { Box, Container, Typography, Button } from '@mui/material';
import './AboutPage.css';
import artesaniaIcon from "../../assets/icons/artesania-icon.png";
import comidaIcon from "../../assets/icons/comida-icon.png";
import boteIcon from "../../assets/icons/bote-icon.png";
import { Link } from 'react-router-dom';
import aboutUs from '../../assets/imgs/about-us.jpeg';

export default function AboutPage() {
    return (
        <Container maxWidth="lg" sx={{ py: 6 }}>
            {/* Título Principal */}
            <Typography variant="h2" align="center" sx={{ fontWeight: 800, mb: 4, color: '#333' }}>
                Sobre Paita
            </Typography>

            <img
                src={aboutUs}
                alt="Experiencia Paita"
                className="about-hero-img"
            />

            {/* Texto Introductorio */}
            <div className="about-intro-container">
                <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
                    Llevamos viajeros a descubrir la esencia de Piura desde hace más de 15 años.
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                    Paita es una ciudad portuaria del norte del Perú donde el mar define la vida cotidiana,
                    la cultura y el trabajo de su gente.
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8, mt: 2 }}>
                    En Navega Paita, nacemos como un proyecto de turismo marino-costero que busca conectar
                    a los visitantes con la experiencia real de la pesca artesanal, la gastronomía local y
                    el paisaje costero, generando beneficios directos para la comunidad durante temporadas
                    de veda y promoviendo un turismo más consciente.
                </Typography>
            </div>

            {/* Tres Columnas de Características */}
            <div className="about-grid-features">
                {/* Card 1: Artesanía */}
                <div className="feature-card">
                    <img src={artesaniaIcon} alt="Icono Artesanía" className="feature-custom-icon" />
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>Artesanía Viva</Typography>
                    <Typography className="feature-card-text">
                        Participa en experiencias donde conocerás los saberes tradicionales vinculados a la
                        pesca artesanal de Paita, como el tejido y reparación de redes, el uso de aparejos
                        y los conocimientos transmitidos entre generaciones de pescadores.
                    </Typography>
                </div>

                {/* Card 2: Comida */}
                <div className="feature-card">
                    <img src={comidaIcon} alt="Icono Ceviche" className="feature-custom-icon" />
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>Rutas de Sabor</Typography>
                    <Typography className="feature-card-text">
                        Descubre la gastronomía marina de Paita a través de preparaciones tradicionales
                        elaboradas con pesca fresca local. Conocerás las especies de la zona, su relación
                        con la temporada de pesca y los sabores que forman parte de la identidad costera.
                    </Typography>
                </div>

                {/* Card 3: Bote */}
                <div className="feature-card">
                    <img src={boteIcon} alt="Icono Agencia" className="feature-custom-icon" />
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>Turismo Consciente</Typography>
                    <Typography className="feature-card-text">
                        Promovemos experiencias de bajo impacto ambiental que respetan los ciclos del mar
                        y generan ingresos complementarios para pescadores artesanales durante la veda,
                        fortaleciendo la economía local y la conservación del ecosistema marino.
                    </Typography>
                </div>
            </div>

            {/* Secciones Divididas (Imagen + Texto) */}
            <div className="about-section-split">
                <img
                    src="https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?auto=format&fit=crop&q=80&w=600"
                    className="split-image"
                    alt="Gastronomía Paita"
                />
                <div>
                    <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>¿Por qué viajar con nosotros?</Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                        Porque Navega Paita no ofrece turismo convencional.
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Nuestras experiencias están diseñadas junto a pescadores artesanales y se basan en
                        la vida real del puerto, la pesca responsable y la gastronomía local. Aquí no eres
                        un espectador: eres parte de una experiencia auténtica que conecta cultura,
                        bienestar y mar.
                    </Typography>
                </div>
            </div>

            {/* Sección Misión y Visión */}
            <div className="mission-vision-section">
                <Typography variant="h4" align="center" sx={{ fontWeight: 700, mb: 6, color: '#333' }}>
                    Nuestra Misión y Visión
                </Typography>
                <div className="mission-vision-grid">
                    {/* Misión */}
                    <div className="mission-card">
                        <div className="mv-icon-wrapper mission-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10" />
                                <circle cx="12" cy="12" r="6" />
                                <circle cx="12" cy="12" r="2" />
                            </svg>
                        </div>
                        <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>Misión</Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                            Contribuir al desarrollo de Paita a través del turismo marino-costero sostenible,
                            generando oportunidades para la comunidad pesquera y promoviendo experiencias
                            auténticas que respeten el mar y su cultura.
                        </Typography>
                    </div>

                    {/* Visión */}
                    <div className="vision-card">
                        <div className="mv-icon-wrapper vision-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                                <circle cx="12" cy="12" r="3" />
                            </svg>
                        </div>
                        <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>Visión</Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                            Ser referente del turismo marino-costero en el norte del Perú, reconocidos por
                            conectar a los viajeros con la autenticidad del puerto de Paita y por impulsar
                            el desarrollo sostenible de sus comunidades pescadoras.
                        </Typography>
                    </div>
                </div>
            </div>

            {/* Banner de Propósito */}
            <div className="purpose-banner">
                <Box sx={{ maxWidth: '70%' }}>
                    <Typography variant="h5" sx={{ fontWeight: 700 }}>Nuestro Propósito</Typography>
                    <Typography variant="body1" color="text.secondary">
                        Contribuir al desarrollo de Paita a través del turismo marino-costero sostenible,
                        generando oportunidades para la comunidad pesquera y promoviendo experiencias
                        auténticas que respeten el mar y su cultura.
                    </Typography>
                </Box>
                <Button
                    component={Link}
                    to="/destinos"
                    variant="contained"
                    sx={{
                        bgcolor: 'black',
                        color: 'white',
                        px: 4,
                        py: 1.5,
                        textTransform: 'none',
                        '&:hover': {
                            bgcolor: '#333',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                        }
                    }}
                >
                    Descubrir más
                </Button>
            </div>
        </Container>
    );
}