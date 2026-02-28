import { useState, useEffect, useCallback } from 'react';
import {
    Container, Box, Typography, Button, Paper, Table, TableBody,
    TableCell, TableContainer, TableHead, TableRow, IconButton,
    Chip, Dialog, DialogTitle, DialogContent, Avatar
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import DirectionsBoatIcon from '@mui/icons-material/DirectionsBoat';
import { vesselService } from '../../core/services/vessel.service';
import { VesselForm } from './VesselForm';
import EditIcon from "@mui/icons-material/Edit";
import {
    Select, MenuItem, FormControl
} from '@mui/material';

const STATUS_OPTIONS = [
    { value: 'OPERATIVE', label: 'Operativa', color: 'success' },
    { value: 'BUSY', label: 'En viaje', color: 'info' },
    { value: 'MAINTENANCE', label: 'Mantenimiento', color: 'warning' },
    { value: 'REPAIR', label: 'En Reparación', color: 'error' },
    { value: 'OUT_OF_SERVICE', label: 'Fuera de Servicio', color: 'default' },
];

export default function VesselsPage() {
    const [selectedVessel, setSelectedVessel] = useState<any>(null); // Estado para edición
    const [vessels, setVessels] = useState([]);
    const [open, setOpen] = useState(false);
    const [isInitialLoad, setIsInitialLoad] = useState(true);

    const handleStatusChange = async (id: number, newStatus: string) => {
        try {
            await vesselService.updateStatus(id, newStatus);
            // Actualizamos el estado local para reflejar el cambio inmediatamente
            setVessels((prev: any) =>
                prev.map((v: any) => v.id === id ? { ...v, status: newStatus } : v)
            );
        } catch (error) {
            alert("Error al actualizar el estado");
            console.error(error);
        }
    };

    const loadVessels = useCallback(async () => {
        try {
            const data = await vesselService.getAll();
            setVessels(data);
        } catch (error) {
            console.error("Error loading vessels:", error);
        } finally {
            setIsInitialLoad(false);
        }
    }, []);

    useEffect(() => {
        let isMounted = true;

        if (isMounted) {
            loadVessels();
        }

        return () => { isMounted = false; };
    }, [loadVessels]);

    const handleEdit = (vessel: any) => {
        setSelectedVessel(vessel);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedVessel(null); // Limpiar al cerrar
    };

    const handleDelete = async (id: number) => {
        if (confirm('¿Eliminar esta embarcación?')) {
            await vesselService.deleteVessel(id);
            loadVessels();
        }
    };

    return (
        <Container maxWidth="lg" sx={{ py: 4, minHeight: '100vh' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4, alignItems: 'center' }}>
                <Typography variant="h4" fontWeight="bold">
                    <DirectionsBoatIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Embarcaciones
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => setOpen(true)}
                    sx={{ borderRadius: 2 }}
                >
                    Nueva Embarcación
                </Button>
            </Box>

            <TableContainer component={Paper} elevation={3} sx={{ borderRadius: 3 }}>
                <Table>
                    <TableHead sx={{ bgcolor: '#f5f5f5' }}>
                        <TableRow>
                            <TableCell>Imagen</TableCell>
                            <TableCell>Nombre / Matrícula</TableCell>
                            <TableCell>Tipo</TableCell>
                            <TableCell>Capacidad</TableCell>
                            <TableCell>Dueño</TableCell>
                            <TableCell>Estado</TableCell>
                            <TableCell align="right">Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {vessels.map((v: any) => (
                            <TableRow key={v.id} hover>
                                <TableCell>
                                    <Avatar
                                        src={v.image?.url}
                                        variant="rounded"
                                        sx={{ width: 60, height: 40 }}
                                    />
                                </TableCell>
                                <TableCell>
                                    <Typography variant="subtitle2">{v.name}</Typography>
                                    <Typography variant="caption" color="textSecondary">{v.registrationNumber}</Typography>
                                </TableCell>
                                <TableCell>{v.type}</TableCell>
                                <TableCell>{v.capacity} pax</TableCell>
                                <TableCell>{v.owner ? `${v.owner.firstName} ${v.owner.lastName}` : 'N/A'}</TableCell>
                                <TableCell>
                                    <FormControl size="small" sx={{ minWidth: 150 }}>
                                        <Select
                                            value={v.status}
                                            onChange={(e) => handleStatusChange(v.id, e.target.value)}
                                            sx={{
                                                borderRadius: 2,
                                                fontSize: '0.875rem',
                                                bgcolor: 'background.paper',
                                                '& .MuiSelect-select': {
                                                    py: 0.5,
                                                    display: 'flex',
                                                    alignItems: 'center'
                                                }
                                            }}
                                        >
                                            {STATUS_OPTIONS.map((option) => (
                                                <MenuItem key={option.value} value={option.value}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        <Box
                                                            sx={{
                                                                width: 8,
                                                                height: 8,
                                                                borderRadius: '50%',
                                                                bgcolor: `${option.color}.main`
                                                            }}
                                                        />
                                                        {option.label}
                                                    </Box>
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </TableCell>
                                <TableCell align="right">
                                    <IconButton onClick={() => handleEdit(v)} color="primary">
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton onClick={() => handleDelete(v.id)} color="error">
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Modal para el Formulario */}
            <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
                <DialogTitle sx={{ fontWeight: 'bold' }}>
                    {selectedVessel ? 'Editar Embarcación' : 'Registrar Nueva Embarcación'}
                </DialogTitle>
                <DialogContent dividers>
                    <VesselForm
                        vesselToEdit={selectedVessel}
                        onSuccess={() => {
                            handleClose();
                            loadVessels();
                        }}
                    />
                </DialogContent>
            </Dialog>
        </Container>
    );
}