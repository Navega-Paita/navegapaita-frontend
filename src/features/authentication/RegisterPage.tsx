import { useState } from 'react';
import { Box, TextField, Button, Typography, Container, Paper, Alert, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { authService} from "../../core/services/auth.service.ts";

export default function RegisterPage() {
    const [formData, setFormData] = useState({
        email: '', password: '', firstName: '', lastName: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await authService.register(formData);
            // Tras registrar, podemos loguearlo automáticamente o mandarlo al login
            navigate('/login', { state: { message: 'Registro exitoso. Ahora inicia sesión.' } });
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <Container maxWidth="sm" sx={{ py: 8 }}>
            <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
                    <Typography variant="h5" align="center" gutterBottom fontWeight={600}>
                        Crear Cuenta
                    </Typography>

                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12 }}>
                                <TextField
                                    fullWidth label="Nombre" required
                                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                                />
                            </Grid>
                            <Grid size={{ xs: 12 }}>
                                <TextField
                                    fullWidth label="Apellido" required
                                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                                />
                            </Grid>
                            <Grid size={{ xs: 12 }}>
                                <TextField
                                    fullWidth label="Email" type="email" required
                                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                                />
                            </Grid>
                            <Grid size={{ xs: 12 }}>
                                <TextField
                                    fullWidth label="Contraseña" type="password" required
                                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                                />
                            </Grid>
                        </Grid>
                        <Button
                            fullWidth variant="contained" type="submit"
                            sx={{ mt: 3, mb: 2, py: 1.5, fontWeight: 'bold' }}
                        >
                            Registrarse
                        </Button>
                    </form>
                </Paper>
            </Box>
        </Container>
    );
}