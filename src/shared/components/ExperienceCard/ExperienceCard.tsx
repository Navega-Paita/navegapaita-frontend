import { Card, CardContent, CardMedia, Typography, Box, Chip } from '@mui/material';
import type { Experience } from "../../models/experience.ts";

interface ExperienceCardProps {
    experience: Experience;
}

export default function ExperienceCard({ experience }: ExperienceCardProps) {
    // TypeScript ahora sabe que originalPrice y price son números
    const hasDiscount = !!(experience.originalPrice && experience.originalPrice > experience.price);

    return (
        <Card
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
                    image={experience.image}
                    alt={experience.title}
                    sx={{ objectFit: 'cover' }}
                />
                {experience.tag && (
                    <Chip
                        label={experience.tag}
                        size="small"
                        sx={{
                            position: 'absolute',
                            top: 12,
                            left: 12,
                            backgroundColor: 'rgba(0,0,0,0.7)',
                            color: 'white',
                            fontWeight: 600,
                            fontSize: '11px'
                        }}
                    />
                )}
            </Box>

            <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: 2.5, backgroundColor: '#ffffff' }}>
                <Typography
                    sx={{
                        fontSize: '13px',
                        color: 'text.secondary',
                        fontWeight: 500,
                        mb: 1
                    }}
                >
                    {experience.duration}
                </Typography>

                <Typography
                    variant="h6"
                    sx={{
                        fontSize: '18px',
                        fontWeight: 700,
                        mb: 2,
                        lineHeight: 1.3,
                        flexGrow: 1
                    }}
                >
                    {experience.title}
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography
                        sx={{
                            fontSize: '13px',
                            color: 'text.secondary',
                            mr: 0.5
                        }}
                    >
                        Desde
                    </Typography>

                    {hasDiscount && experience.originalPrice && (
                        <Typography
                            sx={{
                                fontSize: '14px',
                                color: 'text.secondary',
                                textDecoration: 'line-through',
                                fontWeight: 500
                            }}
                        >
                            USD ${experience.originalPrice.toLocaleString()}
                        </Typography>
                    )}

                    <Typography
                        sx={{
                            fontSize: '18px',
                            fontWeight: 700,
                            color: hasDiscount ? 'primary.main' : 'text.primary'
                        }}
                    >
                        USD ${experience.price.toLocaleString()}
                    </Typography>
                </Box>
            </CardContent>
        </Card>
    );
}