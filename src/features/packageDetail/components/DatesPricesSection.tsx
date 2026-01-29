import { useState } from "react";
import {
    Box, TextField, MenuItem, Typography, Button,
    Collapse, Chip
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
        <Box className="tab-content" sx={{ bgcolor: 'white', borderRadius: 2, overflow: 'hidden' }}>
            {/* Buscador y Filtros - Stack vertical en móvil */}
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
                    <MenuItem value="low">Precio (bajo)</MenuItem>
                    <MenuItem value="high">Precio (alto)</MenuItem>
                </TextField>
            </Box>

            {/* Cabecera - Oculta en móvil */}
            <Box sx={{
                display: { xs: 'none', md: 'flex' },
                px: 3, py: 1, borderBottom: '1px solid #eee', color: 'text.secondary'
            }}>
                <Typography sx={{ flex: 2, fontWeight: 600, fontSize: '0.85rem' }}>Inicio</Typography>
                <Typography sx={{ flex: 2, fontWeight: 600, fontSize: '0.85rem' }}>Final</Typography>
                <Typography sx={{ flex: 3, fontWeight: 600, fontSize: '0.85rem' }}>Estado</Typography>
                <Typography sx={{ flex: 2, fontWeight: 600, fontSize: '0.85rem', textAlign: 'right' }}>
                    Precios desde <InfoOutlinedIcon sx={{ fontSize: 14, verticalAlign: 'middle' }} />
                </Typography>
            </Box>

            {/* Filas */}
            {filtered.map((d, i) => {
                const isExpanded = expandedRow === i;
                const isFullyBooked = d.spaceLeft === 0;
                const finalPrice = d.price * (1 - d.discount / 100);

                return (
                    <Box key={i} sx={{ borderBottom: '1px solid #eee' }}>
                        {/* Fila Principal Responsive */}
                        <Box
                            onClick={() => !isFullyBooked && handleRowClick(i)}
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                px: { xs: 2, md: 3 },
                                py: { xs: 2, md: 3 },
                                cursor: isFullyBooked ? 'default' : 'pointer',
                                transition: 'background 0.2s',
                                '&:hover': { bgcolor: isFullyBooked ? 'transparent' : '#f9f9f9' },
                                opacity: isFullyBooked ? 0.7 : 1
                            }}
                        >
                            {/* FECHA INICIO (Siempre visible) */}
                            <Typography sx={{ flex: { xs: 1.5, md: 2 }, fontWeight: 500, fontSize: { xs: '0.9rem', md: '1rem' } }}>
                                {d.startDate}
                            </Typography>

                            {/* FECHA FINAL (Oculta en móvil) */}
                            <Typography sx={{ flex: 2, fontWeight: 500, display: { xs: 'none', md: 'block' } }}>
                                {d.endDate}
                            </Typography>

                            {/* ESTADO / TAG (Lógica responsive para el badge) */}
                            <Box sx={{ flex: { xs: 1, md: 3 }, display: 'flex', alignItems: 'center', gap: 1 }}>
                                {d.discount > 0 && (
                                    <Chip
                                        label={ { xs: '%', md: 'En Venta' }[ 'xs' ] } // Label corto en móvil
                                        size="small"
                                        sx={{
                                            bgcolor: '#00695c', color: 'white', fontWeight: 'bold', borderRadius: '4px',
                                            '& .MuiChip-label': { px: { xs: 1, md: 1.5 } }
                                        }}
                                        // Si prefieres que diga "En Venta" siempre, solo quita el objeto label de arriba
                                        label="En Venta"
                                    />
                                )}

                                {/* Ocultar textos de disponibilidad en móvil para no saturar la fila */}
                                <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                                    {isFullyBooked ? (
                                        <Typography sx={{ fontWeight: 700 }}>Lleno</Typography>
                                    ) : (
                                        <Typography variant="body2" sx={{ color: d.spaceLeft < 5 ? 'error.main' : 'text.secondary', fontWeight: d.spaceLeft < 5 ? 700 : 400 }}>
                                            {d.spaceLeft < 5 ? `${d.spaceLeft} espacios` : 'Disponible'}
                                        </Typography>
                                    )}
                                </Box>
                            </Box>

                            {/* PRECIO (Siempre visible) */}
                            <Box sx={{ flex: { xs: 1.5, md: 2 }, textAlign: 'right', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1 }}>
                                <Box>
                                    {d.discount > 0 && !isFullyBooked && (
                                        <Typography
                                            variant="caption"
                                            sx={{ textDecoration: 'line-through', color: 'text.secondary', display: 'block', fontSize: '0.7rem' }}
                                        >
                                            ${d.price}
                                        </Typography>
                                    )}
                                    <Typography sx={{ fontWeight: 700, fontSize: { xs: '1rem', md: '1.2rem' } }}>
                                        {isFullyBooked ? '-' : `$${finalPrice}`}
                                    </Typography>
                                </Box>
                                {!isFullyBooked && (isExpanded ? <KeyboardArrowUpIcon fontSize="small" /> : <KeyboardArrowDownIcon fontSize="small" />)}
                            </Box>
                        </Box>

                        {/* Detalle Expandible (Responsive) */}
                        <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                            <Box sx={{
                                p: { xs: 2, md: 4 },
                                bgcolor: '#f4f4f4',
                                display: 'flex',
                                flexDirection: { xs: 'column', md: 'row' },
                                gap: { xs: 2, md: 4 }
                            }}>
                                {/* Timeline */}
                                <Box sx={{ borderLeft: '2px dotted #ccc', pl: 2 }}>
                                    <Typography variant="caption" sx={{ fontWeight: 700 }}>INICIA</Typography>
                                    <Typography variant="body2" sx={{ mb: 1 }}>{d.startDate}</Typography>
                                    <Typography variant="caption" sx={{ fontWeight: 700 }}>TERMINA</Typography>
                                    <Typography variant="body2">{d.endDate}</Typography>
                                </Box>

                                {/* Botón y Detalles */}
                                <Box sx={{
                                    flexGrow: 1, bgcolor: 'white', p: 2, borderRadius: 1, border: '1px solid #ddd',
                                    display: 'flex', flexDirection: { xs: 'column', sm: 'row' },
                                    justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' },
                                    gap: 2
                                }}>
                                    <Box>
                                        <Typography sx={{ fontWeight: 700 }}>RESERVA</Typography>
                                        <Typography variant="caption" color="primary">{d.spaceLeft} espacios disponibles</Typography>
                                    </Box>
                                    <Button
                                        variant="contained"
                                        fullWidth={true} // Full width solo en móvil si es necesario por el contenedor
                                        sx={{ bgcolor: 'black', color: 'white', textTransform: 'none', px: 4, maxWidth: { sm: '200px' } }}
                                        onClick={() => console.log("Reservando:", d)}
                                    >
                                        Solicitar reserva
                                    </Button>
                                </Box>
                            </Box>
                        </Collapse>
                    </Box>
                );
            })}
        </Box>
    );
}