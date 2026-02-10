import { Box, Container, Typography, Breadcrumbs, Link, Button } from '@mui/material';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import { mockWishlistApi} from "../search/ search.mock.ts";
import ExperienceCard from '../../shared/components/ExperienceCard/ExperienceCard';

export default function WishlistPage() {
    const response = mockWishlistApi();

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            {/* 1. Breadcrumb */}
            <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 4, fontSize: '0.85rem' }}>
                <Link underline="hover" color="inherit" href="/">
                    Home
                </Link>
                <Typography color="text.primary">Lista de deseos</Typography>
            </Breadcrumbs>

            {/* 2. Título y Frase */}
            <Box sx={{ textAlign: 'center', mb: 6 }}>
                <Typography variant="h3" sx={{ fontWeight: 600, mb: 2, fontFamily: 'Montserrat' }}>
                    Mi Lista de deseos
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary' }}>
                    Empieza a crear tu lista de deseos
                </Typography>
                <Typography color="text.secondary">
                    Explora viajes y añade tus favoritos para más tarde
                </Typography>
            </Box>

            {/* 3. Botón Remover */}
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'flex-start' }}>
                <Button
                    variant="outlined"
                    startIcon={<DeleteSweepIcon />}
                    sx={{
                        textTransform: 'none',
                        color: 'black',
                        borderColor: 'black',
                        fontWeight: 500,
                        '&:hover': { borderColor: '#333', bgcolor: '#f5f5f5' }
                    }}
                    onClick={() => console.log("Remover todos los viajes")}
                >
                    Eliminar todos los viajes
                </Button>
            </Box>

            {/* 4. Grid de Experiencias */}
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
                {response.items.map(exp => (
                    <Box key={exp.id} sx={{ width: '100%' }}>
                        <ExperienceCard experience={exp} />
                    </Box>
                ))}
            </Box>
        </Container>
    );
}