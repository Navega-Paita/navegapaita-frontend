import { useState } from "react";
import {
    Box, TextField, MenuItem, Typography, Button,
    Collapse, Chip
} from "@mui/material";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import type { AvailabilityItem } from "../../../shared/models/package.ts";

export default function AvailabilitySection({ dates }: { dates: AvailabilityItem[] }) {
    const [query, setQuery] = useState("");
    const [sort, setSort] = useState("date");
    const [expandedRow, setExpandedRow] = useState<number | null>(null);

    const filtered = dates
        .filter(d => d.startDate.toLowerCase().includes(query.toLowerCase()))
        .sort((a, b) => {
            // Ordenamos siempre por fecha (más próxima primero)
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
                    Reserva
                </Typography>
            </Box>

            {/* Filas */}
            {filtered.map((d, i) => {
                const isExpanded = expandedRow === i;
                const isFullyBooked = d.spaceLeft === 0;

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
                                cursor: 'default',
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

                            {/* ESTADO / TAG (Lógica de Disponibilidad) */}
                            <Box sx={{ flex: { xs: 1, md: 3 }, display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Chip
                                    label={
                                        <Box component="span">
                                            {/* Texto dinámico según disponibilidad */}
                                            {d.spaceLeft === 0 ? "Agotado" : (
                                                <>
                                                    <Box component="span" sx={{ display: { xs: 'inline', md: 'none' } }}>
                                                        {d.spaceLeft} cupos
                                                    </Box>
                                                    <Box component="span" sx={{ display: { xs: 'none', md: 'inline' } }}>
                                                        Disponibilidad: {d.spaceLeft} espacios
                                                    </Box>
                                                </>
                                            )}
                                        </Box>
                                    }
                                    size="small"
                                    sx={{
                                        // Cambia de color: Gris si está lleno, Azul/Verde si hay cupos
                                        bgcolor: d.spaceLeft === 0 ? '#e0e0e0' : '#e0f2f1',
                                        color: d.spaceLeft === 0 ? '#757575' : '#00695c',
                                        border: d.spaceLeft === 0 ? 'none' : '1px solid #b2dfdb',
                                        fontWeight: 'bold',
                                        borderRadius: '4px',
                                        '& .MuiChip-label': {
                                            px: { xs: 1, md: 1.5 },
                                            fontSize: { xs: '0.65rem', md: '0.75rem' }
                                        }
                                    }}
                                />
                            </Box>

                            {/* ACCIÓN (Botón de Reserva) */}
                            <Box sx={{ flex: { xs: 1.5, md: 2 }, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1 }}>
                                {!isFullyBooked ? (
                                    <Button
                                        variant="contained"
                                        sx={{
                                            bgcolor: 'black',
                                            color: 'white',
                                            textTransform: 'none',
                                            px: 4,
                                            borderRadius: 1,
                                            '&:hover': { bgcolor: '#333' }
                                        }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            console.log("Reservando fecha:", d.startDate);
                                        }}
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
        </Box>
    );
}