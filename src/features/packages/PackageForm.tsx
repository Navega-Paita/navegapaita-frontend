import React, { useState, useRef } from 'react';
import {
    Box, Button, TextField, Typography, IconButton, Paper,
    Select, MenuItem, FormControl, InputLabel, Divider, Grid, Container, Card,
    Alert, Collapse
} from '@mui/material';
import { Add, Delete, CloudUpload, ArrowBack, Save } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import './PackageForm.css';
import { ImageCropper } from "../../shared/components/ImageCropper/ImageCropper.tsx";
import { cloudinaryService } from "../../core/services/cloudinary.service.ts";

// ─── Interfaces ──────────────────────────────────────────────────────────────
interface ItineraryItem {
    title: string;
    description: string;
    includedActivities: string[];
    optionalActivities: string[];
}

interface AvailabilityItem {
    startDate: string;
    endDate: string;
    spaceLeft: number;
}

interface FormErrors {
    title?: string;
    description?: string;
    duration?: string;
    transport?: string;
    meals?: string;
    price?: string;
    destinations?: string;
    images?: string;
    itineraries?: string;
    availability?: string;
}

interface ItineraryErrors {
    [index: number]: { title?: string; description?: string };
}

interface AvailabilityErrors {
    [index: number]: { startDate?: string; endDate?: string; spaceLeft?: string; dateRange?: string };
}

// ─── Componente Principal ─────────────────────────────────────────────────────
export default function PackageCreatePage() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    // 1. Datos Básicos
    const [formData, setFormData] = useState({
        title: '', description: '', duration: '', meals: '', transport: '',
        minAge: 6, groupSize: 12, type: 'Paseo', price: 0, discount: 0
    });

    // 2. Listas Dinámicas
    const [destinations, setDestinations] = useState<string[]>([]);
    const [tempDest, setTempDest] = useState('');
    const [itineraries, setItineraries] = useState<ItineraryItem[]>([]);
    const [availability, setAvailability] = useState<AvailabilityItem[]>([]);

    // 3. Imágenes
    const [croppedImages, setCroppedImages] = useState<Blob[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);
    const [filesToProcess, setFilesToProcess] = useState<string[]>([]);
    const [isCropping, setIsCropping] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // 4. Errores
    const [errors, setErrors] = useState<FormErrors>({});
    const [itineraryErrors, setItineraryErrors] = useState<ItineraryErrors>({});
    const [availabilityErrors, setAvailabilityErrors] = useState<AvailabilityErrors>({});

    // ─── Precio Final ──────────────────────────────────────────────────────
    const finalPrice = formData.price - (formData.price * (formData.discount / 100));

    // ─── Handlers: Itinerario ──────────────────────────────────────────────
    const addItinerary = () => {
        setItineraries([...itineraries, {
            title: '', description: '',
            includedActivities: [], optionalActivities: []
        }]);
    };

    const updateItinerary = (index: number, field: keyof Pick<ItineraryItem, 'title' | 'description'>, value: string) => {
        const updated = [...itineraries];
        updated[index][field] = value;
        setItineraries(updated);

        // Limpiar error del campo al escribir
        if (itineraryErrors[index]?.[field]) {
            setItineraryErrors(prev => ({
                ...prev,
                [index]: { ...prev[index], [field]: undefined }
            }));
        }
    };

    const removeItinerary = (index: number) => {
        setItineraries(itineraries.filter((_, i) => i !== index));
        const newErrors = { ...itineraryErrors };
        delete newErrors[index];
        setItineraryErrors(newErrors);
    };

    // ─── Handlers: Disponibilidad ──────────────────────────────────────────
    const addAvailability = () => {
        setAvailability([...availability, { startDate: '', endDate: '', spaceLeft: 10 }]);
    };

    const updateAvailability = (index: number, field: keyof AvailabilityItem, value: string | number) => {
        const updated = [...availability];
        (updated[index] as any)[field] = value;
        setAvailability(updated);

        // Limpiar error del campo al cambiar
        if (availabilityErrors[index]) {
            setAvailabilityErrors(prev => ({
                ...prev,
                [index]: { ...prev[index], [field]: undefined, dateRange: undefined }
            }));
        }
    };

    const removeAvailability = (index: number) => {
        setAvailability(availability.filter((_, i) => i !== index));
        const newErrors = { ...availabilityErrors };
        delete newErrors[index];
        setAvailabilityErrors(newErrors);
    };

    // ─── Handlers: Destinos ────────────────────────────────────────────────
    const addDestination = () => {
        if (tempDest.trim() !== '') {
            setDestinations([...destinations, tempDest.trim()]);
            setTempDest('');
            // Limpiar error de destinos al agregar uno
            if (errors.destinations) {
                setErrors(prev => ({ ...prev, destinations: undefined }));
            }
        }
    };

    const handleTempDestKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addDestination();
        }
    };

    // ─── Handlers: Imágenes ────────────────────────────────────────────────
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const urls = Array.from(e.target.files).map(file => URL.createObjectURL(file));
            setFilesToProcess(urls);
            setIsCropping(true);
        }
    };

    const handleCropComplete = (blob: Blob) => {
        setCroppedImages(prev => [...prev, blob]);
        setPreviews(prev => [...prev, URL.createObjectURL(blob)]);
        const remaining = filesToProcess.slice(1);
        setFilesToProcess(remaining);
        if (remaining.length === 0) setIsCropping(false);

        // Limpiar error de imágenes
        if (errors.images) {
            setErrors(prev => ({ ...prev, images: undefined }));
        }
    };

    const removeImage = (index: number) => {
        setCroppedImages(prev => prev.filter((_, i) => i !== index));
        setPreviews(prev => prev.filter((_, i) => i !== index));
    };

    // ─── Limpiar errores al escribir en formData ───────────────────────────
    const handleFormDataChange = (field: keyof typeof formData, value: string | number) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field as keyof FormErrors]) {
            setErrors(prev => ({ ...prev, [field]: undefined }));
        }
    };

    // ─── Validación completa ───────────────────────────────────────────────
    const validate = (): boolean => {
        let isValid = true;
        const newErrors: FormErrors = {};
        const newItineraryErrors: ItineraryErrors = {};
        const newAvailabilityErrors: AvailabilityErrors = {};

        // --- Información General ---
        if (!formData.title.trim()) {
            newErrors.title = 'El título es obligatorio.';
            isValid = false;
        }
        if (!formData.description.trim()) {
            newErrors.description = 'La descripción es obligatoria.';
            isValid = false;
        }
        if (!formData.duration.trim()) {
            newErrors.duration = 'La duración es obligatoria.';
            isValid = false;
        }
        if (!formData.transport.trim()) {
            newErrors.transport = 'El transporte es obligatorio.';
            isValid = false;
        }
        if (!formData.meals.trim()) {
            newErrors.meals = 'Las comidas son obligatorias.';
            isValid = false;
        }
        if (!formData.price || formData.price <= 0) {
            newErrors.price = 'El precio debe ser mayor a 0.';
            isValid = false;
        }

        // --- Destinos ---
        if (destinations.length === 0) {
            newErrors.destinations = 'Agrega al menos un destino.';
            isValid = false;
        }

        // --- Imágenes ---
        if (croppedImages.length === 0) {
            newErrors.images = 'Sube al menos una imagen para la galería.';
            isValid = false;
        }

        // --- Itinerario ---
        if (itineraries.length === 0) {
            newErrors.itineraries = 'Agrega al menos un elemento al itinerario.';
            isValid = false;
        } else {
            itineraries.forEach((item, index) => {
                const itemErrors: { title?: string; description?: string } = {};
                if (!item.title.trim()) {
                    itemErrors.title = 'El título es obligatorio.';
                    isValid = false;
                }
                if (!item.description.trim()) {
                    itemErrors.description = 'La descripción es obligatoria.';
                    isValid = false;
                }
                if (Object.keys(itemErrors).length > 0) {
                    newItineraryErrors[index] = itemErrors;
                }
            });
        }

        // --- Disponibilidad ---
        if (availability.length === 0) {
            newErrors.availability = 'Agrega al menos una fecha de disponibilidad.';
            isValid = false;
        } else {
            availability.forEach((item, index) => {
                const itemErrors: { startDate?: string; endDate?: string; spaceLeft?: string; dateRange?: string } = {};

                if (!item.startDate) {
                    itemErrors.startDate = 'La fecha de inicio es obligatoria.';
                    isValid = false;
                }
                if (!item.endDate) {
                    itemErrors.endDate = 'La fecha de fin es obligatoria.';
                    isValid = false;
                }
                if (item.startDate && item.endDate) {
                    const start = new Date(item.startDate);
                    const end = new Date(item.endDate);
                    if (end <= start) {
                        itemErrors.dateRange = 'La fecha de fin debe ser posterior a la de inicio.';
                        isValid = false;
                    }
                }
                if (!item.spaceLeft || item.spaceLeft <= 0) {
                    itemErrors.spaceLeft = 'Los cupos deben ser mayor a 0.';
                    isValid = false;
                }
                if (Object.keys(itemErrors).length > 0) {
                    newAvailabilityErrors[index] = itemErrors;
                }
            });
        }

        setErrors(newErrors);
        setItineraryErrors(newItineraryErrors);
        setAvailabilityErrors(newAvailabilityErrors);
        return isValid;
    };

    // ─── Submit ────────────────────────────────────────────────────────────
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) {
            // Scroll al primer error
            const firstError = document.querySelector('.Mui-error, .section-error');
            firstError?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return;
        }

        setLoading(true);

        try {
            const slug = formData.title
                .toLowerCase()
                .trim()
                .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // Quitar tildes
                .replace(/[^\w\s-]/g, '')
                .replace(/[\s_-]+/g, '-')
                .replace(/^-+|-+$/g, '');

            console.log("Subiendo imágenes a Cloudinary...");
            const uploadPromises = croppedImages.map((blob, index) =>
                cloudinaryService.uploadImage(blob, `pkg_${slug}_${Date.now()}_${index}`)
            );
            const uploadedImages = await Promise.all(uploadPromises);

            const payload = {
                ...formData,
                slug,
                destinations,
                imageGallery: uploadedImages,
                itinerary: itineraries,
                availability: availability,
            };

            console.log("🚀 PAYLOAD LISTO PARA ENVIAR AL BACKEND:");
            console.log(JSON.stringify(payload, null, 2));

            // await packageService.create(payload);
            alert(`¡Paquete "${formData.title}" armado con éxito! Revisa la consola.`);

        } catch (error) {
            console.error("Error al armar el paquete:", error);
            alert("Hubo un error al procesar las imágenes o los datos.");
        } finally {
            setLoading(false);
        }
    };

    // ─── Render ────────────────────────────────────────────────────────────
    return (
        <Container maxWidth="lg" sx={{ py: 5 }}>
            <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
                <IconButton onClick={() => navigate(-1)}><ArrowBack /></IconButton>
                <Typography variant="h4" fontWeight={700}>Crear Nuevo Paquete</Typography>
            </Box>

            <form onSubmit={handleSubmit} noValidate>
                <Grid container spacing={4}>

                    {/* ── COLUMNA IZQUIERDA ─────────────────────────── */}
                    <Grid size={{ xs: 12, md: 8 }}>

                        {/* Información General */}
                        <Card sx={{ p: 3, mb: 3 }} className="form-card">
                            <Typography variant="h6" gutterBottom>Información General</Typography>
                            <Grid container spacing={2}>
                                <Grid size={{ xs: 12 }}>
                                    <TextField
                                        fullWidth
                                        label="Título del Paquete"
                                        variant="outlined"
                                        value={formData.title}
                                        onChange={e => handleFormDataChange('title', e.target.value)}
                                        error={!!errors.title}
                                        helperText={errors.title}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12 }}>
                                    <TextField
                                        fullWidth multiline rows={4}
                                        label="Descripción"
                                        value={formData.description}
                                        onChange={e => handleFormDataChange('description', e.target.value)}
                                        error={!!errors.description}
                                        helperText={errors.description}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, md: 4 }}>
                                    <TextField
                                        fullWidth
                                        label="Duración"
                                        placeholder="Ej: 4 horas"
                                        value={formData.duration}
                                        onChange={e => handleFormDataChange('duration', e.target.value)}
                                        error={!!errors.duration}
                                        helperText={errors.duration}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, md: 4 }}>
                                    <TextField
                                        fullWidth
                                        label="Transporte"
                                        value={formData.transport}
                                        onChange={e => handleFormDataChange('transport', e.target.value)}
                                        error={!!errors.transport}
                                        helperText={errors.transport}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, md: 4 }}>
                                    <TextField
                                        fullWidth
                                        label="Comidas"
                                        placeholder="Ej: Almuerzo marino"
                                        value={formData.meals}
                                        onChange={e => handleFormDataChange('meals', e.target.value)}
                                        error={!!errors.meals}
                                        helperText={errors.meals}
                                    />
                                </Grid>
                            </Grid>
                        </Card>

                        {/* Itinerario */}
                        <Card sx={{ p: 3, mb: 3 }} className="form-card">
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                <Typography variant="h6">Itinerario</Typography>
                                <Button startIcon={<Add />} onClick={addItinerary}>
                                    Agregar Día/Fase
                                </Button>
                            </Box>

                            {/* Error de sección */}
                            <Collapse in={!!errors.itineraries}>
                                <Alert severity="error" sx={{ mb: 2 }} className="section-error">
                                    {errors.itineraries}
                                </Alert>
                            </Collapse>

                            {itineraries.length === 0 ? (
                                <Typography variant="body2" color="textSecondary" sx={{ textAlign: 'center', py: 2 }}>
                                    No hay elementos. Haz clic en "Agregar Día/Fase" para comenzar.
                                </Typography>
                            ) : (
                                itineraries.map((item, index) => (
                                    <Box
                                        key={index}
                                        sx={{
                                            p: 2, mb: 2,
                                            border: (itineraryErrors[index]) ? '1px solid #d32f2f' : '1px solid #eee',
                                            borderRadius: 2
                                        }}
                                    >
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                            <Typography variant="subtitle1" fontWeight={600}>
                                                Elemento #{index + 1}
                                            </Typography>
                                            <IconButton color="error" onClick={() => removeItinerary(index)}>
                                                <Delete />
                                            </IconButton>
                                        </Box>
                                        <TextField
                                            fullWidth
                                            label="Título del hito"
                                            size="small"
                                            sx={{ mb: 1 }}
                                            value={item.title}
                                            onChange={e => updateItinerary(index, 'title', e.target.value)}
                                            error={!!itineraryErrors[index]?.title}
                                            helperText={itineraryErrors[index]?.title}
                                        />
                                        <TextField
                                            fullWidth multiline rows={2}
                                            label="Descripción de actividades"
                                            size="small"
                                            value={item.description}
                                            onChange={e => updateItinerary(index, 'description', e.target.value)}
                                            error={!!itineraryErrors[index]?.description}
                                            helperText={itineraryErrors[index]?.description}
                                        />
                                    </Box>
                                ))
                            )}
                        </Card>

                        {/* Disponibilidad */}
                        <Card sx={{ p: 3, mb: 3 }} className="form-card">
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                <Typography variant="h6">Fechas de Disponibilidad</Typography>
                                <Button startIcon={<Add />} onClick={addAvailability}>
                                    Agregar Fecha
                                </Button>
                            </Box>

                            {/* Error de sección */}
                            <Collapse in={!!errors.availability}>
                                <Alert severity="error" sx={{ mb: 2 }} className="section-error">
                                    {errors.availability}
                                </Alert>
                            </Collapse>

                            {availability.length === 0 ? (
                                <Typography variant="body2" color="textSecondary" sx={{ textAlign: 'center', py: 2 }}>
                                    No hay fechas asignadas. Haz clic en "Agregar Fecha" para habilitar el paquete.
                                </Typography>
                            ) : (
                                availability.map((item, index) => (
                                    <Box
                                        key={index}
                                        sx={{
                                            p: 2, mb: 2,
                                            border: availabilityErrors[index] ? '1px solid #d32f2f' : '1px solid #eee',
                                            borderRadius: 2
                                        }}
                                    >
                                        <Grid container spacing={2} alignItems="flex-start">
                                            <Grid size={{ xs: 12, md: 4 }}>
                                                <TextField
                                                    fullWidth
                                                    label="Fecha Inicio"
                                                    type="date"
                                                    size="small"
                                                    InputLabelProps={{ shrink: true }}
                                                    value={item.startDate}
                                                    onChange={e => updateAvailability(index, 'startDate', e.target.value)}
                                                    error={!!availabilityErrors[index]?.startDate}
                                                    helperText={availabilityErrors[index]?.startDate}
                                                />
                                            </Grid>
                                            <Grid size={{ xs: 12, md: 4 }}>
                                                <TextField
                                                    fullWidth
                                                    label="Fecha Fin"
                                                    type="date"
                                                    size="small"
                                                    InputLabelProps={{ shrink: true }}
                                                    value={item.endDate}
                                                    onChange={e => updateAvailability(index, 'endDate', e.target.value)}
                                                    error={!!availabilityErrors[index]?.endDate || !!availabilityErrors[index]?.dateRange}
                                                    helperText={availabilityErrors[index]?.endDate || availabilityErrors[index]?.dateRange}
                                                />
                                            </Grid>
                                            <Grid size={{ xs: 10, md: 3 }}>
                                                <TextField
                                                    fullWidth
                                                    label="Cupos"
                                                    type="number"
                                                    size="small"
                                                    inputProps={{ min: 1 }}
                                                    value={item.spaceLeft}
                                                    onChange={e => updateAvailability(index, 'spaceLeft', Number(e.target.value))}
                                                    error={!!availabilityErrors[index]?.spaceLeft}
                                                    helperText={availabilityErrors[index]?.spaceLeft}
                                                />
                                            </Grid>
                                            <Grid size={{ xs: 2, md: 1 }} sx={{ display: 'flex', alignItems: 'center', pt: '6px !important' }}>
                                                <IconButton color="error" onClick={() => removeAvailability(index)}>
                                                    <Delete />
                                                </IconButton>
                                            </Grid>
                                        </Grid>
                                    </Box>
                                ))
                            )}
                        </Card>
                    </Grid>

                    {/* ── COLUMNA DERECHA ───────────────────────────── */}
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Card sx={{ p: 3, mb: 3, position: 'sticky', top: 20 }} className="form-card">

                            {/* Precio */}
                            <Typography variant="h6" gutterBottom>Precio y Cupos</Typography>
                            <TextField
                                fullWidth type="number"
                                label="Precio Base (USD)"
                                sx={{ mb: 2 }}
                                inputProps={{ min: 0 }}
                                value={formData.price}
                                onChange={e => handleFormDataChange('price', Number(e.target.value))}
                                error={!!errors.price}
                                helperText={errors.price}
                            />
                            <TextField
                                fullWidth type="number"
                                label="Descuento (%)"
                                sx={{ mb: 2 }}
                                inputProps={{ min: 0, max: 100 }}
                                value={formData.discount}
                                onChange={e => handleFormDataChange('discount', Number(e.target.value))}
                            />
                            <Box sx={{ p: 2, bgcolor: '#f9f9f9', borderRadius: 2, mb: 3, border: '1px solid #eee' }}>
                                <Typography variant="caption" color="textSecondary">
                                    Precio con descuento aplicado:
                                </Typography>
                                <Typography variant="h5" color="primary" fontWeight={800}>
                                    USD {finalPrice.toFixed(2)}
                                </Typography>
                            </Box>

                            <Divider sx={{ my: 2 }} />

                            {/* Destinos */}
                            <Typography variant="subtitle2" gutterBottom>Destinos</Typography>
                            <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                                <TextField
                                    size="small"
                                    fullWidth
                                    value={tempDest}
                                    onChange={e => setTempDest(e.target.value)}
                                    onKeyDown={handleTempDestKeyDown}
                                    placeholder="Ej: Paita"
                                    error={!!errors.destinations && destinations.length === 0}
                                />
                                <Button variant="contained" onClick={addDestination} sx={{ minWidth: 40, px: 1 }}>
                                    <Add />
                                </Button>
                            </Box>

                            {/* Error destinos */}
                            <Collapse in={!!errors.destinations}>
                                <Alert severity="error" sx={{ mb: 1, py: 0 }}>
                                    {errors.destinations}
                                </Alert>
                            </Collapse>

                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                                {destinations.map((d, i) => (
                                    <Box key={i} className="tag-item">
                                        {d}
                                        <Delete
                                            sx={{ fontSize: 14, cursor: 'pointer' }}
                                            onClick={() => setDestinations(destinations.filter((_, idx) => idx !== i))}
                                        />
                                    </Box>
                                ))}
                            </Box>

                            <Divider sx={{ my: 2 }} />

                            {/* Galería */}
                            <Typography variant="subtitle2" gutterBottom>
                                Galería ({croppedImages.length} {croppedImages.length === 1 ? 'foto' : 'fotos'})
                            </Typography>
                            <Button
                                fullWidth variant="outlined"
                                component="label"
                                startIcon={<CloudUpload />}
                                sx={{ mb: 1 }}
                            >
                                Subir Fotos
                                <input
                                    type="file" hidden multiple accept="image/*"
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                />
                            </Button>

                            {/* Error imágenes */}
                            <Collapse in={!!errors.images}>
                                <Alert severity="error" sx={{ mb: 1, py: 0 }}>
                                    {errors.images}
                                </Alert>
                            </Collapse>

                            <Grid container spacing={1} sx={{ mb: 3 }}>
                                {previews.map((url, i) => (
                                    <Grid size={4} key={i} sx={{ position: 'relative' }}>
                                        <img
                                            src={url}
                                            style={{ width: '100%', height: '60px', objectFit: 'cover', borderRadius: '4px', display: 'block' }}
                                            alt={`preview-${i}`}
                                        />
                                        <IconButton
                                            size="small"
                                            onClick={() => removeImage(i)}
                                            sx={{
                                                position: 'absolute', top: 0, right: 0,
                                                bgcolor: 'rgba(0,0,0,0.5)', color: 'white',
                                                p: '2px',
                                                '&:hover': { bgcolor: 'rgba(200,0,0,0.7)' }
                                            }}
                                        >
                                            <Delete sx={{ fontSize: 14 }} />
                                        </IconButton>
                                    </Grid>
                                ))}
                            </Grid>

                            <Button
                                fullWidth variant="contained" color="success"
                                size="large" startIcon={<Save />}
                                type="submit" disabled={loading}
                            >
                                {loading ? 'Guardando...' : 'Publicar Paquete'}
                            </Button>
                        </Card>
                    </Grid>
                </Grid>
            </form>

            {/* Modal de recorte */}
            {isCropping && filesToProcess.length > 0 && (
                <ImageCropper
                    imageSrc={filesToProcess[0]}
                    onCropComplete={handleCropComplete}
                    onCancel={() => setIsCropping(false)}
                />
            )}
        </Container>
    );
}