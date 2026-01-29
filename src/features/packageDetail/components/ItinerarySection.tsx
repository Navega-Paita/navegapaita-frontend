import {
    Box,
    Typography,
    Button,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    List,
    ListItem,
    ListItemIcon,
    ListItemText
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AddIcon from "@mui/icons-material/Add";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { useState } from "react";
import type { ItineraryItem } from "../../../shared/models/package";

export default function ItinerarySection({ itinerary }: { itinerary: ItineraryItem[] }) {
    const [expanded, setExpanded] = useState<number[]>([]);

    const allOpen = expanded.length === itinerary.length;

    const handleToggleAll = () => {
        if (allOpen) {
            setExpanded([]);
        } else {
            setExpanded(itinerary.map((_, i) => i));
        }
    };

    const handleToggleOne = (index: number) => {
        setExpanded(prev =>
            prev.includes(index)
                ? prev.filter(i => i !== index)
                : [...prev, index]
        );
    };

    return (
        <Box className="tab-content">
            <Box display="flex" justifyContent="flex-end" mb={2}>
                <Button
                    size="small"
                    variant="outlined"
                    onClick={handleToggleAll}
                    sx={{
                        textTransform: 'none',
                        color: 'text.primary',
                        borderColor: '#ccc',
                        borderRadius: '8px'
                    }}
                >
                    {allOpen ? "Ocultar todo" : "Mostrar todo"}
                </Button>
            </Box>

            {itinerary.map((item, index) => (
                <Accordion
                    key={index}
                    expanded={expanded.includes(index)}
                    onChange={() => handleToggleOne(index)}
                    elevation={0} // Elimina la sombra para que sea plano como el mockup
                    sx={{
                        backgroundColor: '#ffffff', // Fondo blanco puro
                        borderTop: '1px solid #e0e0e0', // Línea superior fina
                        '&:last-child': {
                            borderBottom: '1px solid #e0e0e0', // Línea final
                        },
                        '&:before': {
                            display: 'none', // Elimina la línea divisoria por defecto de MUI
                        },
                        '&.Mui-expanded': {
                            margin: 0, // Evita que el acordeón "salte" o cree márgenes al abrirse
                        }
                    }}
                >
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        sx={{
                            px: 1, // Ajusta el padding lateral para alinear el texto
                            '& .MuiAccordionSummary-content': {
                                my: 2 // Espaciado vertical del título
                            }
                        }}
                    >
                        <Typography fontWeight={600} variant="body1">
                            {item.title}
                        </Typography>
                    </AccordionSummary>

                    <AccordionDetails sx={{ px: 2, pb: 4, pt: 0 }}>
                        {/* Descripción con color más suave */}
                        <Typography sx={{ mb: 3, color: 'text.secondary', lineHeight: 1.6, fontSize: '0.95rem' }}>
                            {item.description}
                        </Typography>

                        {/* Sección: Actividades Incluidas */}
                        {item.includedActivities.length > 0 && (
                            <Box mb={2.5}>
                                <Typography
                                    variant="subtitle2"
                                    sx={{ display: 'flex', alignItems: 'center', fontWeight: 600, mb: 0.5 }}
                                >
                                    <CheckCircleOutlineIcon sx={{ fontSize: 16, mr: 1 }} /> Actividades incluidas
                                </Typography>

                                {/* Lista con sangría y puntos */}
                                <ul style={{
                                    margin: 0,
                                    paddingLeft: '28px', // Sangría alineada con el texto superior
                                    listStyleType: 'disc',
                                    color: '#666' // Color de jerarquía menor
                                }}>
                                    {item.includedActivities.map((act, i) => (
                                        <li key={i} style={{ marginBottom: '4px' }}>
                                            <Typography variant="body2" sx={{ color: 'inherit' }}>
                                                {act}
                                            </Typography>
                                        </li>
                                    ))}
                                </ul>
                            </Box>
                        )}

                        {/* Sección: Actividades Opcionales */}
                        {item.optionalActivities.length > 0 && (
                            <Box>
                                <Typography
                                    variant="subtitle2"
                                    sx={{ display: 'flex', alignItems: 'center', fontWeight: 600, mb: 0.5 }}
                                >
                                    <AddIcon sx={{ fontSize: 16, mr: 1 }} /> Actividades opcionales
                                </Typography>

                                {/* Lista con sangría y puntos */}
                                <ul style={{
                                    margin: 0,
                                    paddingLeft: '28px',
                                    listStyleType: 'disc',
                                    color: '#666'
                                }}>
                                    {item.optionalActivities.map((act, i) => (
                                        <li key={i} style={{ marginBottom: '4px' }}>
                                            <Typography variant="body2" sx={{ color: 'inherit' }}>
                                                {act}
                                            </Typography>
                                        </li>
                                    ))}
                                </ul>
                            </Box>
                        )}
                    </AccordionDetails>
                </Accordion>
            ))}
        </Box>
    );
}

