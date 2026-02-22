import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import ExperienceCard from '../../shared/components/ExperienceCard/ExperienceCard';
import { useState, useEffect } from 'react';
import { Box, Container, Typography, Breadcrumbs, Link, Button, CircularProgress } from '@mui/material';
import { packageService } from "../../core/services/package.service.ts";
import type {PackageCardDto} from "../../shared/dtos/package-card.dto.ts";

export default function WishlistPage() {
    const [packages, setPackages] = useState<PackageCardDto[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchWishlist = async () => {
            const userId = localStorage.getItem('userId');
            if (!userId) {
                setLoading(false);
                return;
            }

            try {
                // Llamamos a tu función original (ahora corregida)
                const data = await packageService.getUserWishlist(parseInt(userId));
                setPackages(data);
            } catch (error) {
                console.error("Error:", error);
                setPackages([]);
            } finally {
                setLoading(false);
            }
        };

        fetchWishlist();
    }, []);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container maxWidth="lg"
                   sx={{
                       py: 4,
                       // 1. Calculamos el alto: 100vh menos la altura estimada del Header y Footer
                       // Ajusta los 200px según el tamaño de tu Navbar + Footer
                       minHeight: 'calc(100vh - 200px)',
                       display: 'flex',
                       flexDirection: 'column'
                   }}>
            {/* 1. Breadcrumb - Intacto */}
            <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 4, fontSize: '0.85rem' }}>
                <Link underline="hover" color="inherit" href="/">Home</Link>
                <Typography color="text.primary">Lista de deseos</Typography>
            </Breadcrumbs>

            {/* 2. Título y Frase - Intacto */}
            <Box sx={{ textAlign: 'center', mb: 6 }}>
                <Typography variant="h3" sx={{ fontWeight: 600, mb: 2 }}>
                    Mi Lista de deseos
                </Typography>
                {/* Corregido: Verificamos length sobre el array real */}
                {packages.length === 0 ? (
                    <Typography variant="h6" color="text.secondary">
                        Tu lista está vacía. ¡Explora y añade experiencias!
                    </Typography>
                ) : (
                    <>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            Tienes {packages.length} experiencias guardadas
                        </Typography>
                        <Typography color="text.secondary">
                            Añade tus favoritos para planear tu próximo viaje
                        </Typography>
                    </>
                )}
            </Box>

            {/* 4. Grid de Experiencias - Intacto */}
            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: {
                        xs: '1fr',
                        sm: 'repeat(2, 1fr)',
                        md: 'repeat(3, 1fr)'
                    },
                    gap: 3,
                    width: '100%'
                }}
            >
                {packages.map(exp => (
                    <Box key={exp.id} sx={{ width: '100%' }}>
                        {/* Pasamos isFavorite como true porque estamos en la wishlist */}
                        <ExperienceCard experience={{...exp, isFavorite: true}}  />
                    </Box>
                ))}
            </Box>
        </Container>
    );
}