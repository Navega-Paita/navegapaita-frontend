import { useState } from 'react';
import {
    Box, TextField, Button, Typography, Container,
    Alert, Link, CircularProgress, IconButton
} from '@mui/material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { authService } from "../../core/services/auth.service.ts";
import { useAuth } from '../../core/context/AuthContext';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const data = await authService.login(email, password);
            login(data);

            const role = data.user.role;
            if (role === 'ADMIN' || role === 'OPERATOR') {
                navigate('/dashboard');
            } else {
                navigate('/');
            }
        } catch (err: any) {
            setError(err.message || 'Credenciales incorrectas');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{
            minHeight: '100vh',
            bgcolor: 'white',
            display: 'flex',
            flexDirection: 'column'
        }}>
            {/* Cabecera / Flecha Volver */}
            <Box sx={{ p: 2 }}>
                <IconButton onClick={() => navigate('/')} sx={{ color: '#0061d5' }}>
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
                    alignItems: 'flex-start'
                }}>

                    <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, color: '#141d38', letterSpacing: '-0.5px' }}>
                        Iniciar sesión
                    </Typography>

                    <Typography variant="body2" sx={{ mb: 4, color: '#616161' }}>
                        Introduce tus datos para gestionar tus operaciones turísticas.
                    </Typography>

                    {error && (
                        <Alert severity="error" variant="filled" sx={{ mb: 3, width: '100%', borderRadius: '8px' }}>
                            {error}
                        </Alert>
                    )}

                    <form onSubmit={handleSubmit} style={{ width: '100%' }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                            <TextField
                                fullWidth
                                label="Email"
                                type="email"
                                variant="outlined"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                disabled={loading}
                            />

                            <TextField
                                fullWidth
                                label="Contraseña"
                                type="password"
                                variant="outlined"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                disabled={loading}
                            />
                        </Box>

                        <Button
                            fullWidth
                            variant="contained"
                            type="submit"
                            disabled={loading}
                            sx={{
                                mt: 5,
                                mb: 3,
                                py: 1.6,
                                fontWeight: 700,
                                borderRadius: '8px',
                                textTransform: 'none',
                                fontSize: '1rem',
                                bgcolor: '#0061d5',
                                boxShadow: 'none',
                                '&:hover': { bgcolor: '#004da9', boxShadow: 'none' }
                            }}
                        >
                            {loading ? <CircularProgress size={24} color="inherit" /> : 'Continuar'}
                        </Button>
                    </form>

                    <Box sx={{ width: '100%', textAlign: 'center', mt: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                            ¿No tienes una cuenta?{' '}
                            <Link
                                component={RouterLink}
                                to="/registro"
                                sx={{
                                    fontWeight: 700,
                                    color: '#0061d5',
                                    textDecoration: 'none',
                                    '&:hover': { textDecoration: 'underline' }
                                }}
                            >
                                Regístrate aquí
                            </Link>
                        </Typography>
                    </Box>
                </Box>
            </Container>
        </Box>
    );
}