import { Box, Container, Paper, Typography, Avatar, Divider, Button, Stack } from '@mui/material';
import { useAuth } from '../../core/context/AuthContext';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import EmailIcon from '@mui/icons-material/Email';
import BadgeIcon from '@mui/icons-material/Badge';

export default function ProfilePage() {
    const { user, logout } = useAuth();

    // Si por alguna razón el usuario no está, mostramos un mensaje simple
    if (!user) return <Typography sx={{ p: 5 }}>No se encontró información del usuario.</Typography>;

    return (
        <Container maxWidth="sm" sx={{ py: 8 }}>
            <Paper sx={{ p: 4, borderRadius: 4, textAlign: 'center' }}>
                {/* 1. Encabezado con Avatar */}
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
                    <Avatar
                        sx={{
                            width: 100,
                            height: 100,
                            bgcolor: 'primary.main',
                            mb: 2,
                            fontSize: '2.5rem'
                        }}
                    >
                        {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                    </Avatar>
                    <Typography variant="h4" fontWeight={700}>
                        {user.firstName} {user.lastName}
                    </Typography>
                    <Typography variant="body1" color="primary" sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>
                        {user.role}
                    </Typography>
                </Box>

                <Divider sx={{ my: 3 }} />

                {/* 2. Detalles del Usuario */}
                <Stack spacing={3} sx={{ textAlign: 'left', mb: 4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <EmailIcon color="action" />
                        <Box>
                            <Typography variant="caption" color="text.secondary">Correo Electrónico</Typography>
                            <Typography variant="body1" fontWeight={500}>{user.email}</Typography>
                        </Box>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <BadgeIcon color="action" />
                        <Box>
                            <Typography variant="caption" color="text.secondary">ID de Usuario</Typography>
                            <Typography variant="body1" fontWeight={500}>#{user.id}</Typography>
                        </Box>
                    </Box>
                </Stack>

                <Divider sx={{ my: 3 }} />

                {/* 3. Acciones */}
                <Stack direction="row" spacing={2} justifyContent="center">
                    <Button
                        variant="outlined"
                        color="error"
                        startIcon={<LogoutIcon />}
                        onClick={logout}
                        sx={{ textTransform: 'none', borderRadius: 2 }}
                    >
                        Cerrar Sesión
                    </Button>
                    {/* Podrías añadir un botón de editar perfil aquí en el futuro */}
                </Stack>
            </Paper>
        </Container>
    );
}