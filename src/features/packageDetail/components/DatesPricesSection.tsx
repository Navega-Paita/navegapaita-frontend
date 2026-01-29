import { useState } from "react";
import {
    Box, TextField, MenuItem, Typography, Button,
    Collapse, IconButton, Chip
} from "@mui/material";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import type { DatePriceItem } from "../../../shared/models/package.ts";

export default function DatesPricesSection({ dates }: { dates: DatePriceItem[] }) {
    const [query, setQuery] = useState("");
    const [sort, setSort] = useState("date");
    const [expandedRow, setExpandedRow] = useState<number | null>(null);

    const filtered = dates
        .filter(d => d.startDate.toLowerCase().includes(query.toLowerCase()))
        .sort((a, b) => {
            if (sort === "low") return a.price - b.price;
            if (sort === "high") return b.price - a.price;
            return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
        });

    const handleRowClick = (index: number) => {
        setExpandedRow(expandedRow === index ? null : index);
    };

    return (
        <Box className="tab-content" sx={{ bgcolor: 'white', borderRadius: 2 }}>
            {/* Buscador y Filtros */}
            <Box sx={{ display: 'flex', gap: 2, mb: 3, p: 2 }}>
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
                    sx={{ width: 200 }}
                >
                    <MenuItem value="date">Fechas recientes</MenuItem>
                    <MenuItem value="low">Precio (bajo)</MenuItem>
                    <MenuItem value="high">Precio (alto)</MenuItem>
                </TextField>
            </Box>

            {/* Cabecera de "Tabla" Manual para mejor control de diseño */}
            <Box sx={{ display: 'flex', px: 3, py: 1, borderBottom: '1px solid #eee', color: 'text.secondary' }}>
                <Typography sx={{ flex: 2, fontWeight: 600, fontSize: '0.85rem' }}>Inicio</Typography>
                <Typography sx={{ flex: 2, fontWeight: 600, fontSize: '0.85rem' }}>Final</Typography>
                <Typography sx={{ flex: 3, fontWeight: 600, fontSize: '0.85rem' }}></Typography>
                <Typography sx={{ flex: 2, fontWeight: 600, fontSize: '0.85rem', textAlign: 'right' }}>
                    Precios desde <InfoOutlinedIcon sx={{ fontSize: 14, verticalAlign: 'middle' }} />
                </Typography>
            </Box>

            {/* Filas */}
            {filtered.map((d, i) => {
                const isExpanded = expandedRow === i;
                const isFullyBooked = d.spaceLeft === 0;

                return (
                    <Box key={i} sx={{ borderBottom: '1px solid #eee' }}>
                        {/* Fila Principal */}
                        <Box
                            onClick={() => !isFullyBooked && handleRowClick(i)}
                            sx={{
                                display: 'flex', alignItems: 'center', px: 3, py: 3,
                                cursor: isFullyBooked ? 'default' : 'pointer',
                                transition: 'background 0.2s',
                                '&:hover': { bgcolor: isFullyBooked ? 'transparent' : '#f9f9f9' },
                                opacity: isFullyBooked ? 0.7 : 1
                            }}
                        >
                            <Typography sx={{ flex: 2, fontWeight: 500 }}>{d.startDate}</Typography>
                            <Typography sx={{ flex: 2, fontWeight: 500 }}>{d.endDate}</Typography>

                            <Box sx={{ flex: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
                                {/* El badge aparece si hay cualquier porcentaje de descuento */}
                                {d.discount > 0 && (
                                    <Chip
                                        label="En Venta"
                                        size="small"
                                        sx={{ bgcolor: '#00695c', color: 'white', fontWeight: 'bold', borderRadius: '4px' }}
                                    />
                                )}

                                {isFullyBooked ? (
                                    <Typography sx={{ fontWeight: 700, color: 'text.primary' }}>Lleno</Typography>
                                ) : (
                                    <>
                                        {d.spaceLeft < 5 && (
                                            <Typography color="error" variant="body2" sx={{ fontWeight: 700 }}>
                                                {d.spaceLeft} espacios
                                            </Typography>
                                        )}
                                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>Disponible</Typography>
                                    </>
                                )}
                            </Box>

                            <Box sx={{ flex: 2, textAlign: 'right', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1 }}>
                                <Box>
                                    {/* Si hay descuento, mostramos el precio base (d.price) tachado */}
                                    {d.discount > 0 && !isFullyBooked && (
                                        <Typography
                                            variant="caption"
                                            sx={{ textDecoration: 'line-through', color: 'text.secondary', display: 'block' }}
                                        >
                                            USD ${d.price}
                                        </Typography>
                                    )}

                                    <Typography sx={{ fontWeight: 700, fontSize: '1.2rem' }}>
                                        {isFullyBooked ? '-' : `USD $${d.price * (1 - d.discount / 100)}`}
                                    </Typography>
                                </Box>

                                {!isFullyBooked && (isExpanded ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />)}
                            </Box>
                        </Box>

                        {/* Detalle Expandible */}
                        <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                            <Box sx={{ p: 4, bgcolor: '#f4f4f4', display: 'flex', gap: 4 }}>
                                {/* Timeline de viaje lateral */}
                                <Box sx={{ borderLeft: '2px dotted #ccc', pl: 2, position: 'relative' }}>
                                    <Typography variant="caption" sx={{ fontWeight: 700 }}>INICIA</Typography>
                                    <Typography variant="body2" sx={{ mb: 2 }}>{d.startDate}</Typography>
                                    <Typography variant="caption" sx={{ fontWeight: 700 }}>TERMINA</Typography>
                                    <Typography variant="body2">{d.endDate}</Typography>
                                </Box>

                                {/* Detalles de Alojamiento y Botón */}
                                <Box sx={{ flexGrow: 1, bgcolor: 'white', p: 3, borderRadius: 1, border: '1px solid #ddd', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Box>
                                        <Typography sx={{ fontWeight: 700 }}>RESERVA</Typography>
                                        <Typography variant="caption" color="primary" sx={{ cursor: 'pointer', textDecoration: 'underline' }}>
                                            {d.spaceLeft} espacios faltantes
                                        </Typography>
                                    </Box>
                                    <Box sx={{ textAlign: 'right' }}>
                                        <Typography variant="h6" sx={{ fontWeight: 700 }}>USD ${d.price * (1 - d.discount / 100)}</Typography>
                                        <Typography variant="caption" sx={{ display: 'block', mb: 1 }}>por persona</Typography>
                                        <Button
                                            variant="contained"
                                            sx={{ bgcolor: 'black', color: 'white', textTransform: 'none', px: 4, '&:hover': { bgcolor: '#333' } }}
                                            onClick={() => console.log("Reservando fecha:", d)}
                                        >
                                            Solicitar reserva
                                        </Button>
                                    </Box>
                                </Box>
                            </Box>
                        </Collapse>
                    </Box>
                );
            })}
        </Box>
    );
}