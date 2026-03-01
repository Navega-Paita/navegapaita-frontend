import {
    Box, Container, Typography, Avatar, Divider,
    Button, Stack, Paper, IconButton
} from '@mui/material';
import { useAuth } from '../../core/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LogoutIcon from '@mui/icons-material/Logout';
import EmailIcon from '@mui/icons-material/Email';
import BadgeIcon from '@mui/icons-material/Badge';
import SettingsIcon from '@mui/icons-material/Settings';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';

export default function ProfilePage() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    if (!user) return (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 10 }}>
            <Typography variant="h6" color="text.secondary">No se encontró información del usuario.</Typography>
        </Box>
    );

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#f7f7f7', pb: 8 }}>
            {/* Cabecera de Navegación */}
            <Box sx={{ p: 2, display: 'flex', alignItems: 'center', bgcolor: 'white', borderBottom: '1px solid #e0e0e0' }}>
                <IconButton onClick={() => navigate(-1)} sx={{ color: '#0d47a1' }}>
                    <ArrowBackIcon />
                </IconButton>
                <Typography variant="subtitle1" sx={{ ml: 2, fontWeight: 700, color: '#141d38' }}>
                    Mi Perfil
                </Typography>
            </Box>

            <Container maxWidth="sm" sx={{ mt: 5 }}>
                {/* Card Principal de Perfil */}
                <Paper elevation={0} sx={{
                    p: { xs: 3, md: 5 },
                    borderRadius: '16px',
                    border: '1px solid #ddd',
                    textAlign: 'center',
                    bgcolor: 'white'
                }}>
                    {/* Sección Avatar y Nombre */}
                    <Box sx={{ position: 'relative', display: 'inline-block', mb: 2 }}>
                        <Avatar
                            sx={{
                                width: 110,
                                height: 110,
                                bgcolor: '#0d47a1', // Azul corporativo
                                fontSize: '2.2rem',
                                fontWeight: 600,
                                boxShadow: '0 4px 12px rgba(13, 71, 161, 0.2)'
                            }}
                        >
                            {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                        </Avatar>
                        <Box sx={{
                            position: 'absolute', bottom: 5, right: 5,
                            bgcolor: 'white', borderRadius: '50%', p: 0.5,
                            display: 'flex', boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                        }}>
                            <VerifiedUserIcon sx={{ color: '#2e7d32', fontSize: 20 }} />
                        </Box>
                    </Box>

                    <Typography variant="h4" sx={{ fontWeight: 800, color: '#141d38', mb: 0.5 }}>
                        {user.firstName} {user.lastName}
                    </Typography>

                    <Box sx={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        bgcolor: '#e3f2fd',
                        px: 2, py: 0.5,
                        borderRadius: '20px',
                        mb: 4
                    }}>
                        <Typography variant="caption" sx={{ color: '#0d47a1', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                            {user.role}
                        </Typography>
                    </Box>

                    <Divider sx={{ mb: 4, borderColor: '#f0f0f0' }} />

                    {/* Información Detallada */}
                    <Stack spacing={3} sx={{ textAlign: 'left' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
                            <Box sx={{ p: 1.2, bgcolor: '#f0f4f8', borderRadius: '12px' }}>
                                <EmailIcon sx={{ color: '#546e7a' }} />
                            </Box>
                            <Box>
                                <Typography variant="caption" sx={{ color: '#78909c', fontWeight: 600, display: 'block', mb: -0.5 }}>
                                    CORREO ELECTRÓNICO
                                </Typography>
                                <Typography variant="body1" sx={{ fontWeight: 600, color: '#263238' }}>
                                    {user.email}
                                </Typography>
                            </Box>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
                            <Box sx={{ p: 1.2, bgcolor: '#f0f4f8', borderRadius: '12px' }}>
                                <BadgeIcon sx={{ color: '#546e7a' }} />
                            </Box>
                            <Box>
                                <Typography variant="caption" sx={{ color: '#78909c', fontWeight: 600, display: 'block', mb: -0.5 }}>
                                    ID DE USUARIO
                                </Typography>
                                <Typography variant="body1" sx={{ fontWeight: 600, color: '#263238' }}>
                                    #{user.id}
                                </Typography>
                            </Box>
                        </Box>
                    </Stack>

                    <Divider sx={{ my: 4, borderColor: '#f0f0f0' }} />

                    {/* Acciones de Cuenta */}
                    <Stack spacing={2}>
                        <Button
                            fullWidth
                            variant="contained"
                            startIcon={<SettingsIcon />}
                            sx={{
                                py: 1.5,
                                borderRadius: '12px',
                                textTransform: 'none',
                                fontWeight: 700,
                                bgcolor: '#141d38',
                                boxShadow: 'none',
                                '&:hover': { bgcolor: '#000', boxShadow: 'none' }
                            }}
                        >
                            Configuración de Cuenta
                        </Button>

                        <Button
                            fullWidth
                            variant="text"
                            color="error"
                            startIcon={<LogoutIcon />}
                            onClick={logout}
                            sx={{
                                py: 1.5,
                                borderRadius: '12px',
                                textTransform: 'none',
                                fontWeight: 700,
                                '&:hover': { bgcolor: '#fff5f5' }
                            }}
                        >
                            Cerrar Sesión
                        </Button>
                    </Stack>
                </Paper>

                <Typography variant="body2" align="center" sx={{ mt: 4, color: '#90a4ae' }}>
                    Miembro de NavegaPaita desde 2024
                </Typography>
            </Container>
        </Box>
    );
}