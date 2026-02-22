import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardMedia, Typography, Box, Chip, IconButton } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import type { PackageCardDto } from "../../dtos/package-card.dto.ts";
import { packageService} from "../../../core/services/package.service.ts";

interface ExperienceCardProps {
    experience: PackageCardDto;
}

export default function ExperienceCard({ experience }: ExperienceCardProps) {
    const navigate = useNavigate();
    const [isFavorite, setIsFavorite] = useState(experience.isFavorite);

    const hasDiscount = experience.discount > 0;

    // Manejador para la Card (Navegación)
    const handleCardClick = () => {
        // Usamos el slug dinámico del paquete
        navigate(`/buscar/${experience.slug}`);
    };

    // Manejador para Favoritos (Evita la navegación)
    const handleFavoriteClick = async (e: React.MouseEvent) => {
        e.stopPropagation();

        // 1. Obtener el userId del localStorage
        const storedUserId = localStorage.getItem('userId');

        if (!storedUserId) {
            // Opcional: Redirigir al login si no hay usuario
            alert("Debes iniciar sesión para guardar favoritos");
            navigate('/login');
            return;
        }

        const userId = parseInt(storedUserId, 10);
        const packageId = experience.id;

        // Optimistic Update: Cambiamos la UI antes de que responda el server
        const previousState = isFavorite;
        setIsFavorite(!isFavorite);

        try {
            const result = await packageService.toggleFavorite(userId, packageId);
            // Sincronizamos con lo que diga el servidor por si acaso
            setIsFavorite(result.isFavorite);
            console.log(`Favorito actualizado en DB:`, result.isFavorite);
        } catch (error) {
            // Si falla, revertimos el cambio visual
            setIsFavorite(previousState);
            console.error("Error al guardar favorito:", error);
        }
    };

    return (
        <Card
            onClick={handleCardClick}
            sx={{
                borderRadius: '16px',
                overflow: 'hidden',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                cursor: 'pointer',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 12px 24px rgba(0,0,0,0.15)'
                }
            }}
        >
            <Box sx={{ position: 'relative' }}>
                <CardMedia
                    component="img"
                    height="200"
                    image={experience.mainImage}
                    alt={experience.title}
                    sx={{ width: '100%', objectFit: 'cover' }}
                />

                <IconButton
                    onClick={handleFavoriteClick}
                    sx={{
                        position: 'absolute',
                        top: 12,
                        right: 12,
                        backgroundColor: 'white',
                        zIndex: 10, // Asegura que esté por encima de la imagen
                        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                        '&:hover': { backgroundColor: '#f5f5f5', transform: 'scale(1.1)' },
                        transition: 'transform 0.2s'
                    }}
                >
                    {/* Renderizado condicional del icono basado en el estado */}
                    {isFavorite ? (
                        <FavoriteIcon sx={{ color: '#005b9e' }} />
                    ) : (
                        <FavoriteBorderIcon sx={{ color: 'text.secondary' }} />
                    )}
                </IconButton>
            </Box>

            <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: 2.5, backgroundColor: '#ffffff' }}>
                <Typography sx={{ fontSize: '13px', color: 'text.secondary', fontWeight: 500, mb: 1 }}>
                    {experience.duration}
                </Typography>

                <Typography variant="h6" sx={{ fontSize: '18px', fontWeight: 700, mb: 2, lineHeight: 1.3, flexGrow: 1 }}>
                    {experience.title}
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography sx={{ fontSize: '13px', color: 'text.secondary', mr: 0.5 }}>Desde</Typography>

                    {hasDiscount && (
                        <Typography
                            sx={{
                                fontSize: '14px',
                                color: 'text.secondary',
                                textDecoration: 'line-through',
                                fontWeight: 500
                            }}
                        >
                            USD ${experience.price.toLocaleString()}
                        </Typography>
                    )}

                    <Typography sx={{ fontSize: '18px', fontWeight: 700, color: hasDiscount ? '#005b9e' : 'text.primary' }}>
                        USD ${experience.price.toLocaleString()}
                    </Typography>
                </Box>
            </CardContent>
        </Card>
    );
}