import { Box, Container, Typography, IconButton, Divider, Paper, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function PrivacyPolicyPage() {
    const navigate = useNavigate();

    const handleBack = () => {
        if (window.history.length > 1) {
            navigate(-1);
        } else {
            window.close();
            // Respaldo por si el navegador bloquea window.close()
            navigate('/');
        }
    };

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#f8fafc', py: 4 }}>
            <Container maxWidth="md">
                <Box sx={{ mb: 2 }}>
                    <Button
                        startIcon={<ArrowBackIcon />}
                        onClick={handleBack}
                        sx={{
                            color: '#0061d5',
                            textTransform: 'none',
                            fontWeight: 600,
                            fontSize: '0.95rem',
                        }}
                    >
                        Volver
                    </Button>
                </Box>

                <Paper elevation={0} sx={{ p: { xs: 3, md: 6 }, borderRadius: 3, border: '1px solid #e2e8f0' }}>
                    <Typography variant="h4" sx={{ fontWeight: 800, color: '#141d38', mb: 1 }}>
                        Política de Privacidad y Protección de Datos
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#64748b', mb: 4 }}>
                        Última actualización: Noviembre 2026 &bull; Navega Paita
                    </Typography>

                    <Divider sx={{ mb: 4 }} />

                    <Section title="1. Marco Legal y Responsable">
                        En cumplimiento de la <strong>Ley N° 29733 (Ley de Protección de Datos Personales del Perú)</strong> y su reglamento, Navega Paita garantiza la confidencialidad, seguridad y uso adecuado de los datos personales recopilados a través de nuestra plataforma web y aplicación móvil.
                    </Section>

                    <Section title="2. Datos que Recopilamos">
                        Dependiendo de tu uso en la plataforma, podemos recopilar:
                        <ul>
                            <li><strong>Datos de registro e identidad:</strong> Nombre, apellido y correo electrónico.</li>
                            <li><strong>Datos de reservas y pagos:</strong> Historial de paquetes turísticos adquiridos e identificadores de transacción. <em>Navega Paita no almacena números de tarjetas ni claves bancarias</em>; todos los pagos se procesan de forma segura a través de la pasarela Mercado Pago.</li>
                            <li><strong>Datos de geolocalización (GPS):</strong> Para operadores marítimos y embarcaciones registradas, recopilamos la ubicación en tiempo real únicamente durante los viajes activos con fines de monitoreo y seguridad marítima.</li>
                            <li><strong>Comunicaciones:</strong> Mensajes enviados a través del canal de soporte y monitoreo en caso de operaciones activas.</li>
                        </ul>
                    </Section>

                    <Section title="3. Finalidad del Tratamiento">
                        Tus datos serán utilizados exclusivamente para:
                        <ul>
                            <li>Gestionar el registro, acceso a la plataforma y administración de tu cuenta.</li>
                            <li>Procesar reservas de experiencias turísticas y emitir confirmaciones de pago.</li>
                            <li>Brindar soporte, monitoreo en tiempo real y asistencia en emergencias durante las rutas marítimas.</li>
                            <li>Mejorar la calidad del servicio mediante valoraciones y reseñas voluntarias.</li>
                        </ul>
                    </Section>

                    <Section title="4. Seguridad y Almacenamiento">
                        Implementamos medidas técnicas de cifrado de contraseñas, comunicación segura (HTTPS) y control de acceso en nuestras bases de datos para evitar la pérdida, mal uso o acceso no autorizado a tu información. No vendemos ni cedemos tus datos personales a terceros con fines comerciales.
                    </Section>

                    <Section title="5. Derechos ARCO (Acceso, Rectificación, Cancelación y Oposición)">
                        Como titular de tus datos personales, tienes derecho a acceder a tu información, solicitar su rectificación si es inexacta, pedir su cancelación u oponerte a su tratamiento cuando corresponda. Para ejercer cualquiera de estos derechos, puedes comunicarte con nosotros a través de los canales oficiales de contacto en la plataforma.
                    </Section>
                </Paper>
            </Container>
        </Box>
    );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <Box sx={{ mb: 3.5 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b', mb: 1, fontSize: '1.1rem' }}>
                {title}
            </Typography>
            <Typography component="div" variant="body2" sx={{ color: '#475569', lineHeight: 1.7, '& ul': { pl: 3, mt: 1 }, '& li': { mb: 0.5 } }}>
                {children}
            </Typography>
        </Box>
    );
}