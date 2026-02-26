import {useState, useEffect, useCallback} from 'react';
import {
    Box, Container, Typography, Button, Table, TableBody,
    TableCell, TableContainer, TableHead, TableRow, Paper,
    IconButton, Chip, Dialog, DialogTitle, DialogContent, Divider
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { userService } from '../../core/services/user.service';
import type { UserStaffDto } from "../../core/services/user.service";

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
                <DialogTitle sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
                    {isEditMode ? `Editar ${selectedUser?.role}` : `Perfil de ${selectedUser?.role}`}
                </DialogTitle>
                <DialogContent>
                    {selectedUser?.role === 'OPERATOR' ? (
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
                    )}
                </DialogContent>
            </Dialog>
        </Container>
    );
}


const OperatorDetailView = ({ user, isEdit, onClose, onRefresh }: any) => {
    const [form, setForm] = useState({ firstName: user.firstName, lastName: user.lastName });

    const handleSave = async () => {
        await userService.updateUser(user.id, form);
        onRefresh();
        onClose();
    };

    return (
        <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant="caption" color="textSecondary">ID del Sistema: {user.id}</Typography>
            <Typography variant="body2">Miembro desde: {new Date().toLocaleDateString()} (Mock)</Typography>

            {isEdit ? (
                <>
                    <input value={form.firstName} onChange={e => setForm({...form, firstName: e.target.value})} placeholder="Nombre" />
                    <input value={form.lastName} onChange={e => setForm({...form, lastName: e.target.value})} placeholder="Apellido" />
                    <Button onClick={handleSave} variant="contained">Guardar Cambios</Button>
                </>
            ) : (
                <Typography variant="h6">{user.firstName} {user.lastName}</Typography>
            )}
        </Box>
    );
};

const FishermanDetailView = ({ user, isEdit, onClose, onRefresh }: any) => {
    // Aquí podrías tener un select para cambiar el estado (Activo/Inactivo)
    return (
        <Box sx={{ pt: 2 }}>
            <Typography variant="h6">{user.firstName} {user.lastName}</Typography>
            <Typography color="primary">{user.email}</Typography>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle2">Datos de Embarcación Asociada:</Typography>
            <Typography variant="body2" color="textSecondary">Aquí jalaríamos su FishermanProfile...</Typography>

            {isEdit && (
                <Box sx={{ mt: 3 }}>
                    <Typography variant="caption">Cambiar Estado de Cuenta:</Typography>
                    {/* Select de estado aquí */}
                    <Button fullWidth variant="outlined" sx={{ mt: 1 }}>Suspender Acceso</Button>
                </Box>
            )}
        </Box>
    );
};