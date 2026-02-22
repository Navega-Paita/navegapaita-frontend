import { Box, Breadcrumbs, Link, Typography, Pagination, CircularProgress } from '@mui/material';
import { useSearchParams } from 'react-router-dom';
import SearchBar from '../../shared/components/SearchBar/SearchBar';
import ExperienceCard from '../../shared/components/ExperienceCard/ExperienceCard';
import { packageService} from "../../core/services/package.service.ts";
import type { PackageCardDto } from "../../shared/dtos/package-card.dto.ts";
import './SearchPage.css';
import { useEffect, useState } from "react";

// Interfaz para el estado local
interface SearchState {
    items: PackageCardDto[];
    total: number;
    pages: number;
}

export default function SearchPage() {
    const [params, setParams] = useSearchParams();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<SearchState>({ items: [], total: 0, pages: 0 });

    // Extraemos todos los parámetros posibles de la URL
    const keyword = params.get('keyword') || '';
    const page = Number(params.get('page') || 1);
    const dateFrom = params.get('date_range_from') || undefined;
    const dateTo = params.get('date_range_to') || undefined;

    // Efecto para asegurar que siempre haya un parámetro 'page'
    useEffect(() => {
        if (!params.get('page')) {
            const newParams = new URLSearchParams(params);
            newParams.set('page', '1');
            setParams(newParams, { replace: true });
        }
    }, [params, setParams]);

    // Efecto principal: Carga de datos cuando cambian los parámetros de la URL
    useEffect(() => {
        const fetchResults = async () => {
            try {
                setLoading(true);

                // Obtenemos userId si existe para el isFavorite
                const userIdStr = localStorage.getItem('userId');
                const userId = userIdStr ? parseInt(userIdStr) : undefined;

                const response = await packageService.searchPackagesPaginated({
                    page,
                    keyword,
                    date_range_from: dateFrom,
                    date_range_to: dateTo
                }, userId);

                setData({
                    items: response.items,
                    total: response.total,
                    pages: response.pages
                });
            } catch (error) {
                console.error("Error en la búsqueda:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchResults();
    }, [page, keyword, dateFrom, dateTo]); // Se ejecuta al cambiar cualquier filtro

    const handlePageChange = (_: unknown, value: number) => {
        const newParams = new URLSearchParams(params);
        newParams.set('page', String(value));
        setParams(newParams);
        // Scroll hacia arriba al cambiar de página
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <Box className="search-page">
            {/* Breadcrumb */}
            <Breadcrumbs className="breadcrumb">
                <Link href="/" sx={{ textDecoration: 'none', color: 'inherit' }}>Home</Link>
                <Typography color="text.primary">Buscar</Typography>
            </Breadcrumbs>

            <br></br>

            {/* Title - Solo se muestra si existe un keyword */}
            {keyword && !loading && (
                <Typography variant="h5" fontWeight={600} mb={3}>
                    {data.total} experiencias encontradas para "{keyword}"
                </Typography>
            )}

            {/* Search bar */}
            <SearchBar />

            <br></br>

            {/* Grid */}
            {loading ? (
                <Box display="flex" justifyContent="center" py={10}>
                    <CircularProgress />
                </Box>
            ) : (
                <>
                    {data.items.length > 0 ? (
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
                            {data.items.map(exp => (
                                <Box key={exp.id}>
                                    <ExperienceCard experience={exp} />
                                </Box>
                            ))}
                        </Box>
                    ) : (
                        <Box textAlign="center" py={10}>
                            <Typography variant="h6" color="text.secondary">
                                No se encontraron experiencias con esos filtros.
                            </Typography>
                        </Box>
                    )}

                    {data.pages > 1 && (
                        <Box display="flex" justifyContent="center" mt={6} mb={4}>
                            <Pagination
                                count={data.pages}
                                page={page}
                                onChange={handlePageChange}
                                color="primary"
                                size="large"
                            />
                        </Box>
                    )}
                </>
            )}
        </Box>
    );
}
