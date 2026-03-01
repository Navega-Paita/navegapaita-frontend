import {useState, useEffect, useCallback} from 'react';
import {
    Box, Container, Typography, Button, Table, TableBody,
    TableCell, TableContainer, TableHead, TableRow, Paper,
    IconButton, Chip, Dialog, DialogTitle, DialogContent, Divider, Stack, Avatar, Grid, TextField
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { userService } from '../../core/services/user.service';
import type { UserStaffDto } from "../../core/services/user.service";
import {UserForm} from "./UserForm.tsx";
import PhishingIcon from '@mui/icons-material/Phishing';
import PhoneIcon from '@mui/icons-material/Phone';
import HomeIcon from '@mui/icons-material/Home';
import ContactEmergencyIcon from '@mui/icons-material/ContactEmergency';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import EmailIcon from '@mui/icons-material/Email';

export default function UserManagementPage() {
    const [users, setUsers] = useState<UserStaffDto[]>([]);
    const [loading, setLoading] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedUser, setSelectedUser] = useState<UserStaffDto | null>(null);
    const [isEditMode, setIsEditMode] = useState(false);

    // 2. Usamos useCallback para que la función sea estable
    const loadUsers = useCallback(async () => {
        setLoading(true);
        try {
            const data = await userService.getStaffMembers();
            console.log(data);
            setUsers(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, []);

    // 3. El useEffect ahora está limpio
    useEffect(() => {
        loadUsers();
    }, [loadUsers]);


    const handleOpenDetails = (user: UserStaffDto, edit: boolean = false) => {
        setSelectedUser(user);
        setIsEditMode(edit);
        setOpenDialog(true);
    };

    const handleDelete = async (id: number) => {
        if (window.confirm("¿Estás seguro de eliminar este usuario?")) {
            await userService.deleteUser(id);
            loadUsers();
        }
    };

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
                <Typography variant="h4" fontWeight="bold">Gestión de Personal</Typography>
                <Button
                    variant="contained"
                    startIcon={<PersonAddIcon />}
                    onClick={() => { setSelectedUser(null); setOpenDialog(true); }}
                >
                    Nuevo Operador
                </Button>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Nombre</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Rol</TableCell>
                            <TableCell align="right">Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={user.id}>
                                {/* Ahora TS reconoce estas propiedades ✅ */}
                                <TableCell>{`${user.firstName} ${user.lastName}`}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>
                                    <Chip
                                        label={user.role}
                                        color={user.role === 'OPERATOR' ? 'primary' : 'secondary'}
                                    />
                                </TableCell>
                                <TableCell align="right">
                                    {/* Icono de Ojo para ver/editar */}
                                    <IconButton onClick={() => handleOpenDetails(user, false)}>
                                        <VisibilityIcon color="action" />
                                    </IconButton>

                                    {/* Icono de Editar directo (solo operators) */}
                                    {user.role === 'OPERATOR' && (
                                        <IconButton onClick={() => handleOpenDetails(user, true)}>
                                            <EditIcon color="primary" />
                                        </IconButton>
                                    )}

                                    <IconButton onClick={() => handleDelete(user.id)}>
                                        <DeleteIcon color="error" />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Modal para Crear/Editar Operador */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth maxWidth="sm">
                <DialogTitle sx={{ borderBottom: 1, borderColor: 'divider', mb: 2, fontWeight: 700 }}>
                    {(() => {
                        if (!selectedUser && !isEditMode) return "Nuevo Miembro del Staff";

                        const roleName = selectedUser?.role === 'OPERATOR' ? 'Operador' : 'Pescador';

                        if (isEditMode) return `Editar ${roleName}`;
                        return `Perfil de ${roleName}`;
                    })()}
                </DialogTitle>
                <DialogContent>
                    {/* 1. Si no hay usuario seleccionado, mostrar formulario de creación */}
                    {!selectedUser ? (
                        <UserForm
                            onSuccess={() => {
                                setOpenDialog(false);
                                loadUsers(); // Recarga la tabla para ver al nuevo operador
                            }}
                        />
                    ) : (
                        /* 2. Si hay usuario, distinguir entre OPERATOR o FISHERMAN */
                        selectedUser.role === 'OPERATOR' ? (
                            <OperatorDetailView
                                user={selectedUser}
                                isEdit={isEditMode}
                                onClose={() => setOpenDialog(false)}
                                onRefresh={loadUsers}
                            />
                        ) : (
                            <FishermanDetailView
                                user={selectedUser}
                                isEdit={isEditMode}
                                onClose={() => setOpenDialog(false)}
                                onRefresh={loadUsers}
                            />
                        )
                    )}
                </DialogContent>
            </Dialog>
        </Container>
    );
}


export const OperatorDetailView = ({ user, isEdit, onClose, onRefresh }: any) => {
    const [form, setForm] = useState({ firstName: user.firstName, lastName: user.lastName });

    const handleSave = async () => {
        // await userService.updateUser(user.id, form);
        onRefresh();
        onClose();
    };

    return (
        <Box sx={{ pt: 1, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            {/* Header: ID y Rol */}
            <Stack direction="row" spacing={1} alignItems="center">
                <Chip
                    icon={<AdminPanelSettingsIcon />}
                    label={user.role}
                    size="small"
                    sx={{ bgcolor: '#141d38', color: 'white', fontWeight: 'bold' }}
                />
                <Typography variant="caption" color="textSecondary">ID del Sistema: #{user.id}</Typography>
            </Stack>

            {isEdit ? (
                <Stack spacing={2}>
                    <TextField
                        fullWidth label="Nombre" size="small"
                        value={form.firstName}
                        onChange={e => setForm({...form, firstName: e.target.value})}
                    />
                    <TextField
                        fullWidth label="Apellido" size="small"
                        value={form.lastName}
                        onChange={e => setForm({...form, lastName: e.target.value})}
                    />
                    <Button
                        onClick={handleSave}
                        variant="contained"
                        fullWidth
                        sx={{ mt: 1, bgcolor: '#0d47a1', textTransform: 'none', fontWeight: 700 }}
                    >
                        Guardar Cambios
                    </Button>
                </Stack>
            ) : (
                <Box>
                    <Typography variant="h5" sx={{ fontWeight: 800, color: '#141d38', mb: 1 }}>
                        {user.firstName} {user.lastName}
                    </Typography>

                    <Stack spacing={1.5}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <EmailIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                            <Typography variant="body2">{user.email}</Typography>
                        </Box>
                        <Divider />
                        <Typography variant="caption" color="textSecondary" sx={{ display: 'block' }}>
                            Miembro del personal con acceso de gestión de operaciones.
                        </Typography>
                    </Stack>
                </Box>
            )}
        </Box>
    );
};
export const FishermanDetailView = ({ user, isEdit, onClose, onRefresh }: any) => {
    const profile = user.fishermanProfile;

    return (
        <Box sx={{ pt: 1 }}>
            {/* Cabecera con Avatar y Estado */}
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 3 }}>
                <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar sx={{ bgcolor: '#0d47a1', width: 56, height: 56 }}>
                        <PhishingIcon />
                    </Avatar>
                    <Box>
                        <Typography variant="h6" sx={{ fontWeight: 700 }}>{user.firstName} {user.lastName}</Typography>
                        <Typography variant="body2" color="textSecondary">{user.email}</Typography>
                    </Box>
                </Stack>
                <Chip
                    label={profile?.status || 'SIN ESTADO'}
                    color={profile?.status === 'AVAILABLE' ? 'success' : 'warning'}
                    sx={{ fontWeight: 'bold' }}
                />
            </Stack>

            <Divider sx={{ mb: 3 }} />

            {/* Grid de Información Detallada */}
            <Grid container spacing={2}>
                <Grid size={{ xs: 6 }}>
                    <Typography variant="caption" color="textSecondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <AssignmentIndIcon sx={{ fontSize: 14 }} /> DNI
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{profile?.dni || '---'}</Typography>
                </Grid>
                <Grid size={{ xs: 6 }}>
                    <Typography variant="caption" color="textSecondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <PhoneIcon sx={{ fontSize: 14 }} /> TELÉFONO
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{profile?.phone || '---'}</Typography>
                </Grid>
                <Grid size={{ xs: 12 }}>
                    <Typography variant="caption" color="textSecondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <HomeIcon sx={{ fontSize: 14 }} /> DIRECCIÓN
                    </Typography>
                    <Typography variant="body2">{profile?.address || '---'}</Typography>
                </Grid>
                <Grid size={{ xs: 12 }}>
                    <Box sx={{ bgcolor: '#fff3e0', p: 1.5, borderRadius: '8px', border: '1px solid #ffe0b2' }}>
                        <Typography variant="caption" color="#e65100" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, fontWeight: 'bold' }}>
                            <ContactEmergencyIcon sx={{ fontSize: 14 }} /> CONTACTO DE EMERGENCIA
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#bf360c', fontWeight: 500 }}>
                            {profile?.emergencyContact || 'No especificado'}
                        </Typography>
                    </Box>
                </Grid>
            </Grid>

            {isEdit && (
                <Box sx={{ mt: 4 }}>
                    <Divider sx={{ mb: 2 }} />
                    <Typography variant="caption" sx={{ color: 'error.main', fontWeight: 'bold' }}>GESTIÓN DE CUENTA</Typography>
                    <Button
                        fullWidth
                        variant="outlined"
                        color="error"
                        sx={{ mt: 1, borderRadius: '8px', textTransform: 'none', fontWeight: 700 }}
                    >
                        Suspender Acceso del Pescador
                    </Button>
                </Box>
            )}
        </Box>
    );
};