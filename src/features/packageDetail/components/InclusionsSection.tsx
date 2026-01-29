import { useState } from "react";
import { Box, Typography, Link, Button } from "@mui/material";
import Grid from '@mui/material/Grid';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import RestaurantOutlinedIcon from '@mui/icons-material/RestaurantOutlined';
import DirectionsBusFilledOutlinedIcon from '@mui/icons-material/DirectionsBusFilledOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import AddIcon from '@mui/icons-material/Add';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import type { Package} from "../../../shared/models/package.ts";

interface Props {
    packageData: Package;
}

export default function InclusionsSection({ packageData }: Props) {
    const [showAllIncluded, setShowAllIncluded] = useState(false);
    const [showAllOptional, setShowAllOptional] = useState(false);

    // Extraemos todas las actividades de todos los días del itinerario
    const allIncluded = packageData.itinerary.flatMap(day => day.includedActivities);
    const allOptional = packageData.itinerary.flatMap(day => day.optionalActivities);

    const LIMIT = 5;
    const visibleIncluded = showAllIncluded ? allIncluded : allIncluded.slice(0, LIMIT);
    const visibleOptional = showAllOptional ? allOptional : allOptional.slice(0, LIMIT);

    return (
        <Box sx={{
            bgcolor: '#fdfaf5',
            p: { xs: 2, md: 4 },
            borderRadius: '12px',
            border: '1px solid #e0e0e0'
        }}
             className="tab-content"
        >
            <Grid container spacing={4}>
                {/* COLUMNA IZQUIERDA: Logística - Usando la prop 'size' */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>

                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <LocationOnOutlinedIcon sx={{ mt: 0.5, fontSize: 20 }} />
                            <Box>
                                <Typography variant="subtitle2" fontWeight={700}>Destinos</Typography>
                                <Typography variant="body2" sx={{ mt: 0.5 }}>
                                    {packageData.destinations.map((dest, i) => (
                                        <Link key={i} href="#" sx={{ color: '#0052cc', mr: 1, textDecoration: 'underline' }}>
                                            {dest}{i < packageData.destinations.length - 1 ? ',' : ''}
                                        </Link>
                                    ))}
                                </Typography>
                            </Box>
                        </Box>

                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <RestaurantOutlinedIcon sx={{ mt: 0.5, fontSize: 20 }} />
                            <Box>
                                <Typography variant="subtitle2" fontWeight={700}>Comidas</Typography>
                                <Typography variant="body2" sx={{ mt: 0.5, color: 'text.secondary' }}>
                                    {packageData.meals}
                                </Typography>
                            </Box>
                        </Box>

                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <DirectionsBusFilledOutlinedIcon sx={{ mt: 0.5, fontSize: 20 }} />
                            <Box>
                                <Typography variant="subtitle2" fontWeight={700}>Transporte</Typography>
                                <Typography variant="body2" sx={{ mt: 0.5, color: 'text.secondary' }}>
                                    {packageData.transport}
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                </Grid>

                {/* COLUMNA DERECHA: Actividades - Usando la prop 'size' */}
                <Grid size={{ xs: 12, md: 6 }}>
                    {/* Actividades Incluidas */}
                    <Box sx={{ mb: 4 }}>
                        <Typography sx={{ display: 'flex', alignItems: 'center', fontWeight: 700, mb: 1, fontSize: '0.9rem' }}>
                            <CheckCircleOutlineIcon sx={{ fontSize: 18, mr: 1 }} /> Actividades incluidas
                        </Typography>
                        <ul style={{ margin: 0, paddingLeft: '26px', listStyleType: 'disc', color: '#555' }}>
                            {visibleIncluded.map((act, i) => (
                                <li key={i} style={{ marginBottom: '6px' }}>
                                    <Typography variant="body2">{act}</Typography>
                                </li>
                            ))}
                        </ul>
                        {allIncluded.length > LIMIT && (
                            <Button
                                onClick={() => setShowAllIncluded(!showAllIncluded)}
                                size="small"
                                endIcon={showAllIncluded ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                                sx={{ ml: 1, textTransform: 'none', fontWeight: 600, color: '#0052cc' }}
                            >
                                {showAllIncluded ? 'Mostrar menos' : `Mostrar todas (${allIncluded.length})`}
                            </Button>
                        )}
                    </Box>

                    <Box sx={{ height: '1px', bgcolor: '#e0e0e0', mb: 4 }} />

                    {/* Actividades Opcionales */}
                    <Box>
                        <Typography sx={{ display: 'flex', alignItems: 'center', fontWeight: 700, mb: 1, fontSize: '0.9rem' }}>
                            <AddIcon sx={{ fontSize: 18, mr: 1 }} /> Actividades opcionales
                        </Typography>
                        <ul style={{ margin: 0, paddingLeft: '26px', listStyleType: 'disc', color: '#555' }}>
                            {visibleOptional.map((act, i) => (
                                <li key={i} style={{ marginBottom: '6px' }}>
                                    <Typography variant="body2">{act}</Typography>
                                </li>
                            ))}
                        </ul>
                        {allOptional.length > LIMIT && (
                            <Button
                                onClick={() => setShowAllOptional(!showAllOptional)}
                                size="small"
                                endIcon={showAllOptional ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                                sx={{ ml: 1, textTransform: 'none', fontWeight: 600, color: '#0052cc' }}
                            >
                                {showAllOptional ? 'Mostrar menos' : `Mostrar todas (${allOptional.length})`}
                            </Button>
                        )}
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
}