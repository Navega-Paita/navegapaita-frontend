import { Box, Container, Typography, Grid, Paper, Link, Breadcrumbs } from '@mui/material';
import {
    Phone as PhoneIcon,
    Email as EmailIcon,
    LocationOn as LocationIcon,
    DirectionsRun as DirectionsRunIcon
} from '@mui/icons-material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

export default function ContactPage() {
    return (
        <Box sx={{ bgcolor: '#f9f7f2', minHeight: '100vh' }}>
            {/* Breadcrumbs / Navegación Superior */}
            <Container maxWidth="lg" sx={{ pt: 2 }}>
                <Breadcrumbs
                    separator={<NavigateNextIcon fontSize="small" />}
                    aria-label="breadcrumb"
                    sx={{ fontSize: '12px' }}
                >
                    <Link underline="hover" color="inherit" href="/">Inicio</Link>
                    <Typography color="text.primary" sx={{ fontSize: '12px' }}>Contáctanos</Typography>
                </Breadcrumbs>
            </Container>

            {/* Encabezado Principal */}
            <Container maxWidth="lg" sx={{ py: 6, textAlign: 'center' }}>
                <Typography variant="h3" sx={{ fontWeight: 600, mb: 2, color: '#1a1a1a' }}>
                    Contáctanos
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 500, color: '#1a1a1a', mb: 1 }}>
                    ¿Cómo podemos ayudarte?
                </Typography>
                <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                    Estamos aquí para ti las 24 horas del día, los 7 días de la semana
                </Typography>
            </Container>

            {/* Contenido de Contacto */}
            <Box sx={{ bgcolor: 'white', py: 10 }}>
                <Container maxWidth="lg">
                    <Grid container spacing={4}>
                        {/* Tarjeta 1: Viaje en curso */}
                        <Grid size={{ xs: 12, md: 6 }} >
                            <ContactCard
                                icon={<DirectionsRunIcon sx={{ fontSize: 32 }} />}
                                title="¿En tu viaje o en camino?"
                                description="Llama al número local en tu Información Esencial del Viaje"
                            />
                        </Grid>

                        {/* Tarjeta 2: Llamadas */}
                        <Grid size={{ xs: 12, md: 6 }}>
                            <ContactCard
                                icon={<PhoneIcon sx={{ fontSize: 32 }} />}
                                title="Llámanos"
                                description="Llámanos al "
                                link={{ label: "+1 707 296 7011", href: "tel:+17072967011" }}
                            />
                        </Grid>

                        {/* Tarjeta 3: Email */}
                        <Grid size={{ xs: 12, md: 6 }}>
                            <ContactCard
                                icon={<EmailIcon sx={{ fontSize: 32 }} />}
                                title="Envíanos un correo"
                                description="Envíanos tu consulta y te responderemos lo antes posible"
                                email="Navegapaita@gmail.com"
                            />
                        </Grid>

                        {/* Tarjeta 4: Dirección */}
                        <Grid size={{ xs: 12, md: 6 }}>
                            <ContactCard
                                icon={<LocationIcon sx={{ fontSize: 32 }} />}
                                title="Nuestra dirección local"
                                description="Nivel 7, 567 Collins Street, Melbourne, VIC, 3000, Australia"
                            />
                        </Grid>
                    </Grid>
                </Container>
            </Box>
        </Box>
    );
}

// Sub-componente para las tarjetas de contacto
interface ContactCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    link?: { label: string; href: string };
    email?: string;
}

function ContactCard({ icon, title, description, link, email }: ContactCardProps) {
    return (
        <Paper
            variant="outlined"
            sx={{
                p: 4,
                height: '100%',
                display: 'flex',
                gap: 3,
                borderRadius: '4px',
                borderColor: '#e0e0e0',
                '&:hover': { boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }
            }}
        >
            <Box sx={{ color: '#1a1a1a' }}>
                {icon}
            </Box>
            <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1, color: '#1a1a1a' }}>
                    {title}
                </Typography>
                <Typography variant="body2" sx={{ color: '#4a4a4a', lineHeight: 1.6 }}>
                    {description}
                    {link && (
                        <Link href={link.href} sx={{ color: '#d32f2f', textDecorationColor: '#d32f2f', fontWeight: 600, ml: 0.5 }}>
                            {link.label}
                        </Link>
                    )}
                </Typography>
                {email && (
                    <Typography variant="body2" sx={{ fontWeight: 700, mt: 1, color: '#1a1a1a' }}>
                        {email}
                    </Typography>
                )}
            </Box>
        </Paper>
    );
}