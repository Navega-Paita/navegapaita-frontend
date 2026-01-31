import { Box, Breadcrumbs, Link, Typography, Pagination } from '@mui/material';
import {useNavigate, useSearchParams} from 'react-router-dom';
import SearchBar from '../../shared/components/SearchBar/SearchBar';
import ExperienceCard from '../../shared/components/ExperienceCard/ExperienceCard';
import { mockSearchApi } from "./ search.mock.ts";
import './SearchPage.css';
import {useEffect} from "react";

export default function SearchPage() {
    const [params, setParams] = useSearchParams();

    const keyword = params.get('keyword') || '';
    const pageParam = params.get('page');
    const page = Number(pageParam || 1);

    useEffect(() => {
        if (!pageParam) {
            const newParams = new URLSearchParams(params);
            newParams.set('page', '1');
            setParams(newParams, { replace: true });
        }
    }, [pageParam, params, setParams]);

    const response = mockSearchApi(page, keyword);

    const handlePageChange = (_: unknown, value: number) => {
        const newParams = new URLSearchParams(params);
        newParams.set('page', String(value));
        setParams(newParams);
    };

    return (
        <Box className="search-page">
            {/* Breadcrumb */}
            <Breadcrumbs className="breadcrumb">
                <Link href="/">Home</Link>
                <Link href="/buscar">Buscar</Link>
            </Breadcrumbs>

            <br></br>

            {/* Title - Solo se muestra si existe un keyword */}
            {keyword && (
                <Typography variant="h5" fontWeight={600} mb={2}>
                    {response.totalItems} experiencias encontradas para "{keyword}"
                </Typography>
            )}

            {/* Search bar */}
            <SearchBar />

            <br></br>

            {/* Grid */}
            <Box
                sx={{
                    display: 'grid',
                    // Define columnas: 1 en móvil (xs), 2 en tablet (sm), 3 en desktop (md)
                    gridTemplateColumns: {
                        xs: '1fr',
                        sm: 'repeat(2, 1fr)',
                        md: 'repeat(3, 1fr)'
                    },
                    gap: 3, // Espacio entre cards
                    width: '100%',
                    mt: 2
                }}
            >
                {response.items.map(exp => (
                    <Box key={exp.id} sx={{ width: '100%' }}>
                        <ExperienceCard experience={exp} />
                    </Box>
                ))}
            </Box>

            {/* Pagination */}
            <Box display="flex" justifyContent="center" mt={4}>
                <Pagination
                    count={response.totalPages}
                    page={page}
                    onChange={handlePageChange}
                    color="primary"
                />
            </Box>
        </Box>
    );
}
