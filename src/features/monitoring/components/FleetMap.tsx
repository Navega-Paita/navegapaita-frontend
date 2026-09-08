import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useFleetTracking } from '../hooks/useFleetTracking';
import boatIconImg from '../../../assets/icons/boat-icon.png';
import type { BoatData } from "../../../shared/models/BoatData.ts";
import { Box, Typography, Paper, Chip, List, ListItemButton, ListItemText, ListItemAvatar, Avatar, Divider } from '@mui/material';
import { DirectionsBoat as BoatIcon, Radar as RadarIcon, Speed as SpeedIcon } from '@mui/icons-material';

// Icono personalizado para la lancha (RF5.7)
const boatIcon = new L.Icon({
    iconUrl: boatIconImg,
    iconSize: [38, 38],
    iconAnchor: [19, 38],
    popupAnchor: [0, -38],
});

// Componente auxiliar para recentrar el mapa al hacer clic en una embarcación del panel lateral
const MapRecenter = ({ center }: { center: [number, number] | null }) => {
    const map = useMap();
    if (center) {
        map.setView(center, 15, { animate: true });
    }
    return null;
};

export const FleetMap = () => {
    const { boats } = useFleetTracking() as { boats: Record<string, BoatData> };
    const [selectedBoatId, setSelectedBoatId] = useState<string | null>(null);
    const [mapCenter, setMapCenter] = useState<[number, number] | null>(null);

    const boatEntries = Object.entries(boats);
    const activeBoatsCount = boatEntries.length;

    // Manejar selección de embarcación desde la lista lateral
    const handleSelectBoat = (id: string, boat: BoatData) => {
        setSelectedBoatId(id);
        const hasPath = boat.path && boat.path.length > 0;
        const pos: [number, number] | null = hasPath
            ? boat.path![boat.path!.length - 1]
            : (boat.lastLocation ? [boat.lastLocation.lat, boat.lastLocation.lng] : null);

        if (pos) {
            setMapCenter(pos);
        }
    };

    return (
        <Box sx={{ p: 3, maxWidth: '1400px', mx: 'auto' }}>
            {/* Cabecera Interna Estilizada */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: '#141d38' }}>
                        Panel de Monitoreo de Embarcaciones
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Seguimiento satelital y telemetría de la flota en tiempo real.
                    </Typography>
                </Box>
                <Chip
                    icon={<RadarIcon />}
                    label={`${activeBoatsCount} ${activeBoatsCount === 1 ? 'Embarcación Activa' : 'Embarcaciones Activas'}`}
                    color="success"
                    variant="outlined"
                    sx={{ fontWeight: 'bold', bgcolor: '#e8f5e9' }}
                />
            </Box>

            {/* Contenedor principal con Mapa y Panel Lateral */}
            <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', md: 'row' } }}>

                {/* Mapa */}
                <Paper elevation={2} sx={{ flex: 1, height: '600px', borderRadius: 3, overflow: 'hidden', position: 'relative' }}>
                    <MapContainer
                        center={[-11.49, -77.20]}
                        zoom={13}
                        style={{ height: '100%', width: '100%' }}
                    >
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; OpenStreetMap contributors'
                        />
                        <MapRecenter center={mapCenter} />

                        {boatEntries.map(([id, boat]) => {
                            const hasPath = boat.path && boat.path.length > 0;
                            const markerPosition: [number, number] | null = hasPath
                                ? boat.path![boat.path!.length - 1]
                                : (boat.lastLocation ? [boat.lastLocation.lat, boat.lastLocation.lng] : null);

                            const speedKmh = ((boat.lastLocation?.speed ?? 0) * 3.6).toFixed(1);

                            return (
                                <React.Fragment key={id}>
                                    {markerPosition && (
                                        <Marker
                                            position={markerPosition}
                                            icon={boatIcon}
                                            eventHandlers={{
                                                click: () => setSelectedBoatId(id)
                                            }}
                                        >
                                            <Popup>
                                                <Box sx={{ p: 0.5 }}>
                                                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#141d38' }}>
                                                        Embarcación: {id}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        Velocidad: {speedKmh} km/h
                                                    </Typography>
                                                </Box>
                                            </Popup>
                                        </Marker>
                                    )}

                                    {hasPath && (
                                        <Polyline
                                            positions={boat.path!}
                                            pathOptions={{
                                                color: selectedBoatId === id ? '#1976d2' : '#2196f3',
                                                weight: selectedBoatId === id ? 6 : 4,
                                                opacity: 0.8
                                            }}
                                            smoothFactor={2.0}
                                        />
                                    )}
                                </React.Fragment>
                            );
                        })}
                    </MapContainer>
                </Paper>

                {/* Panel Lateral de Estado de Flota */}
                <Paper
                    elevation={2}
                    sx={{
                        width: { xs: '100%', md: '360px' },
                        height: '600px',
                        borderRadius: 3,
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: 'hidden'
                    }}
                >
                    <Box sx={{ p: 2, bgcolor: '#f8f9fa', borderBottom: '1px solid #e0e0e0' }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#141d38' }}>
                            Flota en Operación
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            Seleccione una embarcación para centrar el mapa
                        </Typography>
                    </Box>

                    <List sx={{ flex: 1, overflowY: 'auto', p: 0 }}>
                        {boatEntries.length === 0 ? (
                            <Box sx={{ p: 4, textAlign: 'center' }}>
                                <Typography variant="body2" color="text.secondary">
                                    No hay embarcaciones transmitiendo señal actualmente.
                                </Typography>
                            </Box>
                        ) : (
                            boatEntries.map(([id, boat], index) => {
                                const isSelected = selectedBoatId === id;
                                const speedKmh = ((boat.lastLocation?.speed ?? 0) * 3.6).toFixed(1);

                                return (
                                    <React.Fragment key={id}>
                                        {/* 🟢 Usamos ListItemButton en lugar de ListItem con la prop button */}
                                        <ListItemButton
                                            selected={isSelected}
                                            onClick={() => handleSelectBoat(id, boat)}
                                            sx={{
                                                py: 1.5,
                                                px: 2.5,
                                                bgcolor: isSelected ? 'rgba(25, 118, 210, 0.08)' : 'inherit',
                                                '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.04)' }
                                            }}
                                        >
                                            <ListItemAvatar>
                                                <Avatar sx={{ bgcolor: isSelected ? '#1976d2' : '#e0e0e0', color: isSelected ? '#fff' : '#555' }}>
                                                    <BoatIcon />
                                                </Avatar>
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={
                                                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#141d38' }}>
                                                        {id}
                                                    </Typography>
                                                }
                                                secondary={
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                                                        <SpeedIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                                                        <Typography variant="caption" color="text.secondary">
                                                            {speedKmh} km/h
                                                        </Typography>
                                                    </Box>
                                                }
                                            />
                                            <Chip
                                                label="En curso"
                                                size="small"
                                                color="success"
                                                variant="filled"
                                                sx={{ height: 20, fontSize: '0.65rem' }}
                                            />
                                        </ListItemButton>
                                        {index < boatEntries.length - 1 && <Divider component="li" />}
                                    </React.Fragment>
                                );
                            })
                        )}
                    </List>
                </Paper>
            </Box>
        </Box>
    );
};