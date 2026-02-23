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
import { VesselForm } from './VesselForm'; // Tu componente existente

export default function VesselsPage() {
    const [vessels, setVessels] = useState([]);
    const [open, setOpen] = useState(false);
    const [isInitialLoad, setIsInitialLoad] = useState(true);

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
                                    <Chip
                                        label={v.status}
                                        size="small"
                                        color={v.status === 'AVAILABLE' ? 'success' : 'warning'}
                                    />
                                </TableCell>
                                <TableCell align="right">
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
            <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
                <DialogTitle sx={{ fontWeight: 'bold' }}>Registrar Nueva Embarcación</DialogTitle>
                <DialogContent dividers>
                    <VesselForm
                        onSuccess={() => {
                            setOpen(false);
                            loadVessels();
                        }}
                    />
                </DialogContent>
            </Dialog>
        </Container>
    );
}