import React, { useState, useEffect } from 'react';
import {
    Box, Container, Typography, Paper, Table, TableBody,
    TableCell, TableContainer, TableHead, TableRow, IconButton,
    Switch, Chip, Button, Tooltip, CircularProgress, Alert
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
    Delete as DeleteIcon,
    Restore as RestoreIcon,
    Add as AddIcon
} from '@mui/icons-material';
import type { Package } from "../../shared/models/package.ts";
import { packageService} from "../../core/services/package.service.ts";

export default function PackagesPage() {
    const navigate = useNavigate();
    const [packages, setPackages] = useState<Package[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Cargar paquetes al montar el componente
    const fetchPackages = async () => {
        try {
            setLoading(true);
            const data = await packageService.getAllPackagesAdmin();
            setPackages(data);
            setError(null);
        } catch (err: any) {
            setError(err.message || 'Error al cargar los paquetes');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPackages();
    }, []);

    // Handler para alternar la visibilidad en el backend
    const handleToggleVisibility = async (pkg: Package) => {
        const newVisibility = !pkg.isVisible;
        try {
            // Actualización optimista en UI
            setPackages(prev =>
                prev.map(p => p.id === pkg.id ? { ...p, isVisible: newVisibility } : p)
            );
            await packageService.updatePackageStatus(pkg.id, { isVisible: newVisibility });
        } catch (err: any) {
            // Revertir si falla
            setPackages(prev =>
                prev.map(p => p.id === pkg.id ? { ...p, isVisible: pkg.isVisible } : p)
            );
            alert(err.message || 'No se pudo actualizar la visibilidad');
        }
    };

    // Handler para el borrado pasivo / restauración (isActive) en el backend
    const handleToggleActive = async (pkg: Package) => {
        const newActiveState = !pkg.isActive;
        // Si se va a activar, opcionalmente puede volverse visible o mantenerse oculto hasta que decidan. Aquí bajamos active y si se desactiva, isVisible pasa a false.
        const newVisibilityState = newActiveState ? pkg.isVisible : false;

        try {
            // Actualización optimista en UI
            setPackages(prev =>
                prev.map(p => p.id === pkg.id ? { ...p, isActive: newActiveState, isVisible: newVisibilityState } : p)
            );
            await packageService.updatePackageStatus(pkg.id, {
                isActive: newActiveState,
                isVisible: newVisibilityState
            });
        } catch (err: any) {
            // Revertir si falla
            setPackages(prev =>
                prev.map(p => p.id === pkg.id ? { ...p, isActive: pkg.isActive, isVisible: pkg.isVisible } : p)
            );
            alert(err.message || 'No se pudo actualizar el estado del paquete');
        }
    };

    return (
        <Container maxWidth="lg" sx={{ py: 6 }}>
            {/* Cabecera */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: '#141d38' }}>
                        Gestión de Paquetes
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Administra el catálogo, la visibilidad pública y los estados de eliminación pasiva.
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => navigate('/crear-paquete')}
                    sx={{ bgcolor: '#141d38', '&:hover': { bgcolor: '#1f2b4d' } }}
                >
                    Nuevo Paquete
                </Button>
            </Box>

            {/* Manejo de carga y errores */}
            {loading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                    <CircularProgress />
                </Box>
            )}

            {error && (
                <Alert severity="error" sx={{ mb: 4 }}>{error}</Alert>
            )}

            {/* Tabla de Paquetes */}
            {!loading && !error && (
                <TableContainer component={Paper} elevation={2} sx={{ borderRadius: 2 }}>
                    <Table sx={{ minWidth: 650 }} aria-label="tabla de paquetes">
                        <TableHead sx={{ bgcolor: '#f8f9fa' }}>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 'bold' }}>ID</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Título</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Tipo</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Precio</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>Visibilidad</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>Estado</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', textAlign: 'right' }}>Acciones</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {packages.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                                        <Typography color="text.secondary">No hay paquetes registrados.</Typography>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                packages.map((pkg) => (
                                    <TableRow
                                        key={pkg.id}
                                        sx={{
                                            '&:last-child td, &:last-child th': { border: 0 },
                                            opacity: pkg.isActive ? 1 : 0.6,
                                            bgcolor: pkg.isActive ? 'inherit' : '#f9f9f9'
                                        }}
                                    >
                                        <TableCell component="th" scope="row">
                                            #{pkg.id}
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                                                {pkg.title}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {pkg.duration} • {pkg.destinations?.join(', ') || 'Sin destino'}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Chip label={pkg.type} size="small" variant="outlined" />
                                        </TableCell>
                                        <TableCell sx={{ fontWeight: 'bold' }}>
                                            ${Number(pkg.price).toFixed(2)}
                                        </TableCell>

                                        {/* Columna de Visibilidad (isVisible) */}
                                        <TableCell align="center">
                                            <Tooltip title={pkg.isVisible ? "Ocultar del catálogo público" : "Mostrar en el catálogo"}>
                                                <span>
                                                    <Switch
                                                        checked={pkg.isVisible}
                                                        disabled={!pkg.isActive}
                                                        onChange={() => handleToggleVisibility(pkg)}
                                                        color="primary"
                                                    />
                                                </span>
                                            </Tooltip>
                                        </TableCell>

                                        {/* Columna de Estado / Borrado Pasivo (isActive) */}
                                        <TableCell align="center">
                                            <Chip
                                                label={pkg.isActive ? "Activo" : "Eliminado (Pasivo)"}
                                                color={pkg.isActive ? "success" : "default"}
                                                size="small"
                                            />
                                        </TableCell>

                                        {/* Acciones (Soft Delete / Restore) */}
                                        <TableCell align="right">
                                            {pkg.isActive ? (
                                                <Tooltip title="Eliminar (Borrado Pasivo)">
                                                    <IconButton
                                                        color="error"
                                                        onClick={() => handleToggleActive(pkg)}
                                                        size="small"
                                                    >
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </Tooltip>
                                            ) : (
                                                <Tooltip title="Restaurar paquete">
                                                    <IconButton
                                                        color="primary"
                                                        onClick={() => handleToggleActive(pkg)}
                                                        size="small"
                                                    >
                                                        <RestoreIcon />
                                                    </IconButton>
                                                </Tooltip>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Container>
    );
}