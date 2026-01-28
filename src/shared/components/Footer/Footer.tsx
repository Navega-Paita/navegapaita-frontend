import { Box, Container, Typography, IconButton, Link as MuiLink } from '@mui/material';
import { Link } from 'react-router-dom';
import { Instagram, Facebook } from '@mui/icons-material';
import './Footer.css';

export default function Footer() {
    return (
        <Box component="footer" sx={{ mt: 'auto' }}>
            <div className="footer-container">
                <Container maxWidth="lg">
                    <div className="footer-grid">

                        {/* Columna 1: Branding */}
                        <div className="footer-column">
                            <div>
                                <Typography variant="h5" className="logo-text">
                                    Navega<br />PAITA
                                </Typography>
                                <Typography variant="body2" className="description-text">
                                    ¡Consigue lo mejor! Ofertas de viajes, nuevos viajes, inspiración y mucho más.
                                </Typography>
                            </div>
                        </div>

                        {/* Columna 2: Información */}
                        <div className="footer-column col-center">
                            <div>
                                <Typography variant="subtitle1" className="column-title">
                                    INFORMACION
                                </Typography>
                                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                    {/* Nota: MuiLink con component={Link} a veces requiere castear 'to' en TS si da error */}
                                    <MuiLink component={Link} to="/contacto" className="link-item">
                                        Contacto
                                    </MuiLink>
                                    <MuiLink component={Link} to="/sobre-nosotros" className="link-item">
                                        Sobre Nosotros
                                    </MuiLink>
                                </Box>
                            </div>
                        </div>

                        {/* Columna 3: Siguenos */}
                        <div className="footer-column col-right">
                            <div>
                                <Typography variant="subtitle1" className="column-title">
                                    SIGUENOS
                                </Typography>
                                <div className="social-group">
                                    <IconButton
                                        component="a"
                                        href="https://instagram.com"
                                        target="_blank"
                                        rel="noopener noreferrer" // Recomendado por seguridad en TS/React
                                        className="social-icon-btn"
                                    >
                                        <Instagram fontSize="small" />
                                    </IconButton>
                                    <IconButton
                                        component="a"
                                        href="https://facebook.com"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="social-icon-btn"
                                    >
                                        <Facebook fontSize="small" />
                                    </IconButton>
                                </div>
                            </div>
                        </div>

                    </div>
                </Container>
            </div>

            {/* Copyright Bar */}
            <div className="copyright-bar">
                <Typography variant="body2" sx={{ fontWeight: 300 }}>
                    Copyright © 2026 NavegaPaita
                </Typography>
            </div>
        </Box>
    );
}