import {useState, useEffect, useCallback} from 'react';
import {
    Box, Container, Typography, Button, Table, TableBody,
    TableCell, TableContainer, TableHead, TableRow, Paper,
    IconButton, Chip, Dialog, DialogTitle, DialogContent
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { userService } from '../../core/services/user.service';
import type { UserStaffDto } from "../../core/services/user.service";

export default function UserManagementPage() {
    // 1. Tipamos el estado para que reconozca user.firstName, etc.
    const [users, setUsers] = useState<UserStaffDto[]>([]);
    const [loading, setLoading] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

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
                                    {/* Botones de acción */}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Modal para Crear/Editar Operador */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth maxWidth="xs">
                <DialogTitle>{selectedUser ? 'Editar Operador' : 'Registrar Nuevo Operador'}</DialogTitle>
                <DialogContent>
                    {/* Aquí insertarías tu componente UserForm */}
                    <Typography variant="body2" sx={{ mt: 2 }}>
                        Formulario de datos básicos: Nombre, Email, Password.
                    </Typography>
                </DialogContent>
            </Dialog>
        </Container>
    );
}