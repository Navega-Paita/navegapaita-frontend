import { useState } from 'react';
import {
    Box, TextField, Button, Typography, Container,
    Alert, Grid, Link, CircularProgress, IconButton
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { authService } from "../../core/services/auth.service.ts";

export default function RegisterPage() {
    const [formData, setFormData] = useState({
        email: '', password: '', firstName: '', lastName: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false); // Estado para el loading
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Validaciones básicas de interfaz
        if (formData.password.length < 6) {
            return setError('La contraseña debe tener al menos 6 caracteres');
        }

        setLoading(true);
        try {
            await authService.register(formData);
            navigate('/login', { state: { message: 'Registro exitoso. Ahora inicia sesión.' } });
        } catch (err: any) {
            setError(err.message || 'Ocurrió un error inesperado');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{
            minHeight: '100vh',
            bgcolor: 'white', // Fondo gris muy claro como Expedia
            display: 'flex',
            flexDirection: 'column'
        }}>
            {/* Botón de volver arriba a la izquierda */}
            <Box sx={{ p: 2 }}>
                <IconButton onClick={() => navigate(-1)} sx={{ color: '#0061d5' }}>
                    <ArrowBackIcon />
                </IconButton>
            </Box>

            <Container maxWidth="sm" sx={{ mt: 4, mb: 8 }}>
                <Box sx={{
                    bgcolor: 'white',
                    p: { xs: 3, md: 5 },
                    borderRadius: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start' // Alineación a la izquierda como la imagen
                }}>

                    {/* Logo o Icono placeholder si lo deseas */}
                    <Typography variant="h4" sx={{ fontWeight: 800, mb: 1, color: '#141d38' }}>
                        Crear una cuenta
                    </Typography>

                    <Typography variant="body2" sx={{ mb: 4, color: '#616161' }}>
                        Desbloquea una experiencia completa para gestionar tus operaciones.
                    </Typography>

                    {error && <Alert severity="error" sx={{ mb: 3, width: '100%' }}>{error}</Alert>}

                    <form onSubmit={handleSubmit} style={{ width: '100%' }}>
                        <Grid container spacing={2.5}>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    fullWidth label="Nombre" required
                                    variant="outlined"
                                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    fullWidth label="Apellido" required
                                    variant="outlined"
                                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                                />
                            </Grid>
                            <Grid size={{ xs: 12 }}>
                                <TextField
                                    fullWidth label="Email" type="email" required
                                    variant="outlined"
                                    placeholder="ejemplo@correo.com"
                                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                                />
                            </Grid>
                            <Grid size={{ xs: 12 }}>
                                <TextField
                                    fullWidth label="Contraseña" type="password" required
                                    variant="outlined"
                                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                                />
                            </Grid>
                        </Grid>

                        <Button
                            fullWidth
                            variant="contained"
                            type="submit"
                            disabled={loading}
                            sx={{
                                mt: 4,
                                mb: 3,
                                py: 1.5,
                                fontWeight: 'bold',
                                borderRadius: '25px', // Botón redondeado estilo moderno
                                textTransform: 'none',
                                fontSize: '1.1rem',
                                bgcolor: '#0061d5', // Azul Expedia
                                '&:hover': { bgcolor: '#004da9' }
                            }}
                        >
                            {loading ? <CircularProgress size={24} color="inherit" /> : 'Continuar'}
                        </Button>
                    </form>

                    <Box sx={{ width: '100%', textAlign: 'center', mt: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                            ¿Ya tienes una cuenta?{' '}
                            <Link
                                component="button"
                                variant="body2"
                                onClick={() => navigate('/login')}
                                sx={{
                                    fontWeight: 'bold',
                                    color: '#0061d5',
                                    textDecoration: 'none',
                                    '&:hover': { textDecoration: 'underline' }
                                }}
                            >
                                Inicia sesión
                            </Link>
                        </Typography>
                    </Box>
                </Box>
            </Container>
        </Box>
    );
}