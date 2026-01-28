import { Box, Container, Typography, Button } from '@mui/material';
import './AboutPage.css';
import artesaniaIcon from "../../assets/icons/artesania-icon.png";
import comidaIcon from "../../assets/icons/comida-icon.png";
import boteIcon from "../../assets/icons/bote-icon.png";
import { Link } from 'react-router-dom';

export default function AboutPage() {
    return (
        <Container maxWidth="lg" sx={{ py: 6 }}>
            {/* Imagen Principal Título */}
            <Typography variant="h2" align="center" sx={{ fontWeight: 800, mb: 4, color: '#333' }}>
                Sobre Paita
            </Typography>

            <img
                src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1200"
                alt="Experiencia Paita"
                className="about-hero-img"
            />

            {/* Texto Introductorio */}
            <div className="about-intro-container">
                <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
                    Llevamos viajeros a descubrir la esencia de Piura desde hace más de 15 años.
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                    En Navega Paita, no solo somos una agencia de turismo; somos artesanos de experiencias.
                    Nacimos con el propósito de mostrar al mundo la belleza de nuestras costas, el sabor
                    de nuestra pesca y el talento de nuestra gente.
                </Typography>
            </div>

            {/* Tres Columnas de Características */}
            <div className="about-grid-features">
                {/* Card 1: Artesanía */}
                <div className="feature-card">
                    <img src={artesaniaIcon} alt="Icono Artesanía" className="feature-custom-icon" />
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>Artesanía Viva</Typography>
                    <Typography className="feature-card-text">
                        Participa en talleres interactivos con maestros paiteños. Aprenderás técnicas ancestrales de cerámica y tejido, creando piezas únicas que capturan la esencia.
                    </Typography>
                </div>

                {/* Card 2: Comida */}
                <div className="feature-card">
                    <img src={comidaIcon} alt="Icono Ceviche" className="feature-custom-icon" />
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>Rutas de Sabor</Typography>
                    <Typography className="feature-card-text">
                        Disfruta una clase magistral frente al mar. Aprenderás a preparar el auténtico ceviche paiteño usando pesca fresca y limones de Piura.
                    </Typography>
                </div>

                {/* Card 3: Bote */}
                <div className="feature-card">
                    <img src={boteIcon} alt="Icono Agencia" className="feature-custom-icon" />
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>Turismo Consciente</Typography>
                    <Typography className="feature-card-text">
                        Ofrecemos rutas exclusivas que protegen el ecosistema marino. Nuestros viajes generan beneficios directos para las familias locales y pescadores artesanales.
                    </Typography>
                </div>
            </div>

            {/* Secciones Divididas (Imagen + Texto) */}
            <div className="about-section-split">
                <img
                    src="https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?auto=format&fit=crop&q=80&w=600"
                    className="split-image"
                    alt="Ceviche en la playa"
                />
                <div>
                    <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>¿Por qué viajar con nosotros?</Typography>
                    <Typography variant="body1" color="text.secondary">
                        Nuestras expediciones de ceviche en la playa son leyendas locales.
                        Combinamos la pesca del día con técnicas ancestrales para brindarte
                        un banquete que no encontrarás en ningún restaurante convencional.
                    </Typography>
                </div>
            </div>

            {/* Banner de Propósito */}
            <div className="purpose-banner">
                <Box sx={{ maxWidth: '70%' }}>
                    <Typography variant="h5" sx={{ fontWeight: 700 }}>Nuestro Propósito</Typography>
                    <Typography variant="body1" color="text.secondary">
                        Crear un cambio positivo en Paita a través del turismo sostenible y la alegría de viajar.
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
                        textTransform: 'none', // Para que no salga todo en mayúsculas si prefieres
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