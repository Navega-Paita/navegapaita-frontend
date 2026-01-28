import { Box, Container, Typography } from '@mui/material';

export default function WishlistPage() {
    return (
        <Container maxWidth="lg">
            <Box sx={{ py: 8, textAlign: 'center' }}>
                <Typography variant="h3" sx={{ fontWeight: 700, color: 'primary.main' }}>
                    Wishlist Works ✓
                </Typography>
            </Box>
        </Container>
    );
}