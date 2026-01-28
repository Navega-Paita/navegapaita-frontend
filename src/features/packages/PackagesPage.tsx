import { Box, Container, Typography } from '@mui/material';

export default function PackagesPage() {
    return (
        <Container maxWidth="lg">
            <Box sx={{ py: 8, textAlign: 'center' }}>
                <Typography variant="h3" sx={{ fontWeight: 700, color: 'primary.main' }}>
                    Packages Works ✓
                </Typography>
            </Box>
        </Container>
    );
}