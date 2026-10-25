import { useState } from "react";
import {
    Box, TextField, MenuItem, Typography, Button,
    Dialog, DialogTitle, DialogContent, DialogActions,
    Chip, Divider
} from "@mui/material";
import PeopleIcon from '@mui/icons-material/People';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import type { AvailabilityItem } from "../../../shared/models/package.ts";
import { paymentService } from "../../../core/services/payment.service.ts";

interface DatesPricesSectionProps {
    dates: AvailabilityItem[];
    packageId: number;
    packagePrice: number;
    packageDiscount: number; // 👈 Recibimos el descuento
    packageTitle: string;
}

export default function DatesPricesSection({
                                               dates = [],
                                               packageId,
                                               packagePrice,
                                               packageDiscount = 0,
                                               packageTitle
                                           }: DatesPricesSectionProps) {
    const [query, setQuery] = useState("");
    const [sort, setSort] = useState("date");

    const [openDialog, setOpenDialog] = useState(false);
    const [selectedDate, setSelectedDate] = useState<AvailabilityItem | null>(null);
    const [quantity, setQuantity] = useState(1);
    const [loadingPayment, setLoadingPayment] = useState(false);

    // 🟢 Cálculo del precio final aplicando el porcentaje de descuento si existe
    const finalPricePerPerson = packageDiscount > 0
        ? packagePrice * (1 - packageDiscount / 100)
        : packagePrice;

    const filtered = (dates || [])
        .filter(d => d.startDate.toLowerCase().includes(query.toLowerCase()))
        .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());

    const handleOpenDialog = (dateItem: AvailabilityItem) => {
        setSelectedDate(dateItem);
        setQuantity(1);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedDate(null);
    };

    const handleProceedToCheckout = async () => {
        if (!selectedDate) return;

        // 🟢 VALIDACIÓN DE AUTENTICACIÓN
        // Validamos usando únicamente el userId que ya manejas
        const userId = localStorage.getItem('userId');

        if (!userId) {
            alert("Debes iniciar sesión para realizar una reserva.");
            return;
        }

        const timestamp = Date.now();
        const externalReference = `USER_${userId}_PKG_${packageId}_AVAIL_${selectedDate.id}_${timestamp}`;

        const payload = {
            title: `${packageTitle} (${selectedDate.startDate})`,
            price: finalPricePerPerson * quantity,
            quantity: quantity,
            external_reference: externalReference,
            availabilityId: selectedDate.id,
        };

        setLoadingPayment(true);

        try {
            // 🟢 Uso del servicio de pago centralizado
            const data = await paymentService.createPreference(payload);

            if (data.initPoint) {
                window.location.href = data.initPoint;
            } else {
                console.error("Error del servidor MP:", data);
                alert(`No se pudo generar la preferencia: ${data.message || 'Error desconocido'}`);
            }
        } catch (error: any) {
            console.error('Error al conectar con la pasarela de pagos:', error);
            alert(error.message || 'Ocurrió un error de red al procesar la solicitud.');
        } finally {
            setLoadingPayment(false);
        }
    };

    return (
        <Box className="tab-content" sx={{ bgcolor: 'white', borderRadius: '16px', overflow: 'hidden', p: { xs: 1, md: 2 } }}>

            {/* Buscador y Filtros */}
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, mb: 3, p: 2 }}>
                <TextField
                    placeholder="Buscar fechas"
                    variant="outlined"
                    size="small"
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    sx={{ flexGrow: 1 }}
                />
                <TextField
                    select
                    size="small"
                    value={sort}
                    onChange={e => setSort(e.target.value)}
                    sx={{ width: { xs: '100%', sm: 200 } }}
                >
                    <MenuItem value="date">Fechas recientes</MenuItem>
                </TextField>
            </Box>

            {/* Cabecera */}
            <Box sx={{
                display: { xs: 'none', md: 'flex' },
                px: 3, py: 1, borderBottom: '1px solid #eee', color: 'text.secondary'
            }}>
                <Typography sx={{ flex: 2, fontWeight: 600, fontSize: '0.85rem' }}>Inicio</Typography>
                <Typography sx={{ flex: 2, fontWeight: 600, fontSize: '0.85rem' }}>Final</Typography>
                <Typography sx={{ flex: 3, fontWeight: 600, fontSize: '0.85rem' }}>Estado</Typography>
                <Typography sx={{ flex: 2, fontWeight: 600, fontSize: '0.85rem', textAlign: 'right' }}>
                    Reserva
                </Typography>
            </Box>

            {/* Filas de Disponibilidad */}
            {filtered.map((d, i) => {
                const isFullyBooked = d.spaceLeft === 0;

                return (
                    <Box key={d.id || i} sx={{ borderBottom: '1px solid #eee' }}>
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                px: { xs: 2, md: 3 },
                                py: { xs: 2, md: 3 },
                                transition: 'background 0.2s',
                                '&:hover': { bgcolor: isFullyBooked ? 'transparent' : '#f9f9f9' },
                                opacity: isFullyBooked ? 0.7 : 1
                            }}
                        >
                            <Typography sx={{ flex: { xs: 1.5, md: 2 }, fontWeight: 500, fontSize: { xs: '0.9rem', md: '1rem' } }}>
                                {d.startDate}
                            </Typography>

                            <Typography sx={{ flex: 2, fontWeight: 500, display: { xs: 'none', md: 'block' } }}>
                                {d.endDate}
                            </Typography>

                            <Box sx={{ flex: { xs: 1, md: 3 }, display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Chip
                                    label={
                                        <Box component="span">
                                            {d.spaceLeft === 0 ? "Agotado" : `Disponibilidad: ${d.spaceLeft} espacios`}
                                        </Box>
                                    }
                                    size="small"
                                    sx={{
                                        bgcolor: d.spaceLeft === 0 ? '#e0e0e0' : '#e0f2f1',
                                        color: d.spaceLeft === 0 ? '#757575' : '#00695c',
                                        border: d.spaceLeft === 0 ? 'none' : '1px solid #b2dfdb',
                                        fontWeight: 'bold',
                                        borderRadius: '4px',
                                    }}
                                />
                            </Box>

                            <Box sx={{ flex: { xs: 1.5, md: 2 }, display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                                {!isFullyBooked ? (
                                    <Button
                                        variant="contained"
                                        sx={{
                                            bgcolor: 'black',
                                            color: 'white',
                                            textTransform: 'none',
                                            px: 3,
                                            borderRadius: 1,
                                            '&:hover': { bgcolor: '#333' }
                                        }}
                                        onClick={() => handleOpenDialog(d)}
                                    >
                                        Solicitar reserva
                                    </Button>
                                ) : (
                                    <Typography sx={{ fontWeight: 700, color: 'text.disabled', mr: 2 }}>
                                        Agotado
                                    </Typography>
                                )}
                            </Box>
                        </Box>
                    </Box>
                );
            })}

            {/* Modal de Configuración y Pago */}
            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="xs" fullWidth>
                <DialogTitle sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
                    <EventAvailableIcon color="primary" /> Configurar Reserva
                </DialogTitle>
                <DialogContent dividers>
                    {selectedDate && (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <Typography variant="body2" color="text.secondary">
                                Paquete: <strong>{packageTitle}</strong>
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Fecha seleccionada: <strong>{selectedDate.startDate} al {selectedDate.endDate}</strong>
                            </Typography>

                            <Divider />

                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 1 }}>
                                <Typography variant="body1" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <PeopleIcon fontSize="small" /> Cantidad de personas:
                                </Typography>
                                <TextField
                                    type="number"
                                    size="small"
                                    value={quantity}
                                    onChange={(e) => {
                                        const val = parseInt(e.target.value, 10);
                                        if (val > 0 && val <= selectedDate.spaceLeft) {
                                            setQuantity(val);
                                        }
                                    }}
                                    inputProps={{ min: 1, max: selectedDate.spaceLeft }}
                                    sx={{ width: '90px' }}
                                />
                            </Box>
                            <Typography variant="caption" color="text.secondary">
                                Máximo disponible: {selectedDate.spaceLeft} espacios
                            </Typography>

                            <Box sx={{ mt: 2, p: 2, bgcolor: '#f8fafc', borderRadius: 2, border: '1px solid #e2e8f0' }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                    <Typography variant="body2" color="text.secondary">Precio base:</Typography>
                                    <Typography variant="body2" sx={{ textDecoration: packageDiscount > 0 ? 'line-through' : 'none' }}>
                                        S/ {packagePrice.toFixed(2)}
                                    </Typography>
                                </Box>
                                {packageDiscount > 0 && (
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1, color: '#16a34a' }}>
                                        <Typography variant="body2">Descuento aplicado:</Typography>
                                        <Typography variant="body2">-{packageDiscount}% (S/ {finalPricePerPerson.toFixed(2)} c/u)</Typography>
                                    </Box>
                                )}
                                <Divider sx={{ my: 1 }} />
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Total a Pagar:</Typography>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#2563eb' }}>
                                        S/ {(finalPricePerPerson * quantity).toFixed(2)}
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={handleCloseDialog} color="inherit" sx={{ textTransform: 'none' }}>
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleProceedToCheckout}
                        variant="contained"
                        disabled={loadingPayment}
                        sx={{
                            bgcolor: '#2563eb',
                            textTransform: 'none',
                            fontWeight: 'bold',
                            '&:hover': { bgcolor: '#1d4ed8' }
                        }}
                    >
                        {loadingPayment ? 'Conectando con Mercado Pago...' : 'Proceder al Pago'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}