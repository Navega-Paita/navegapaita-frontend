import React, { useEffect, useState, useRef } from 'react';
import {
    Box, TextField, Button, Typography, MenuItem,
    Stack, IconButton, CircularProgress, Alert
} from '@mui/material';
import { CloudUpload as UploadIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { vesselService } from "../../core/services/vessel.service.ts";
import type { CreateVesselDto } from "../../shared/dtos/vessel.dto.ts";
import { ImageCropper } from '../../shared/components/ImageCropper/ImageCropper.tsx';

const initialFormState: CreateVesselDto = {
    name: '',
    registrationNumber: '',
    type: '',
    capacity: 0,
    technicalSpecs: '',
    ownerId: 0,
};

interface VesselFormProps {
    onSuccess?: () => void;
    vesselToEdit?: any;
}

export const VesselForm: React.FC<VesselFormProps> = ({ onSuccess, vesselToEdit }) => {
    const [formData, setFormData] = useState<CreateVesselDto>(vesselToEdit ? {
        name: vesselToEdit.name,
        registrationNumber: vesselToEdit.registrationNumber,
        type: vesselToEdit.type,
        capacity: vesselToEdit.capacity,
        technicalSpecs: vesselToEdit.technicalSpecs,
        ownerId: vesselToEdit.owner?.id || 0,
    } : initialFormState);

    const [loading, setLoading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(vesselToEdit?.image?.url || null);
    const [tempImageSrc, setTempImageSrc] = useState<string | null>(null);
    const [croppedBlob, setCroppedBlob] = useState<Blob | null>(null);
    const [owners, setOwners] = useState<any[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Validación: Verifica si el formulario es válido
    const isFormValid =
        formData.name.trim() !== '' &&
        formData.registrationNumber.trim() !== '' &&
        formData.type.trim() !== '' &&
        formData.capacity > 0 &&
        formData.ownerId !== 0;

    useEffect(() => {
        vesselService.getOwners().then(setOwners);
    }, []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            const reader = new FileReader();
            reader.onload = () => setTempImageSrc(reader.result as string);
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    const handleCropComplete = (blob: Blob) => {
        if (previewUrl && !vesselToEdit) URL.revokeObjectURL(previewUrl);
        const url = URL.createObjectURL(blob);
        setCroppedBlob(blob);
        setPreviewUrl(url);
        setTempImageSrc(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isFormValid) return;

        setLoading(true);
        try {
            if (vesselToEdit) {
                await vesselService.updateVessel(vesselToEdit.id, formData);
            } else {
                await vesselService.registerVesselFull(formData, croppedBlob);
            }
            if (onSuccess) onSuccess();
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <Stack spacing={2.5}>
                <TextField
                    fullWidth label="Nombre de la Embarcación"
                    variant="outlined" required
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                />

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                    <TextField
                        fullWidth label="Matrícula / Registro"
                        variant="outlined" required
                        value={formData.registrationNumber}
                        onChange={e => setFormData({...formData, registrationNumber: e.target.value})}
                    />
                    <TextField
                        fullWidth label="Tipo (ej. Lancha, Yate)"
                        variant="outlined" required
                        value={formData.type}
                        onChange={e => setFormData({...formData, type: e.target.value})}
                    />
                </Stack>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                    <TextField
                        fullWidth label="Capacidad (pasajeros)"
                        type="number" variant="outlined" required
                        value={formData.capacity || ''}
                        onChange={e => setFormData({...formData, capacity: Number(e.target.value)})}
                    />
                    <TextField
                        select fullWidth label="Dueño (Pescador)"
                        required value={formData.ownerId || ''}
                        onChange={e => setFormData({...formData, ownerId: Number(e.target.value)})}
                    >
                        <MenuItem value={0} disabled>Seleccione un dueño</MenuItem>
                        {owners.map(o => (
                            <MenuItem key={o.id} value={o.id}>{o.firstName} {o.lastName}</MenuItem>
                        ))}
                    </TextField>
                </Stack>

                <TextField
                    fullWidth label="Especificaciones Técnicas"
                    multiline rows={3} variant="outlined"
                    placeholder="Detalles del motor, equipamiento, etc."
                    value={formData.technicalSpecs || ''}
                    onChange={e => setFormData({...formData, technicalSpecs: e.target.value})}
                />

                {/* Zona de Imagen Estilo Moderno */}
                <Box sx={{
                    border: '2px dashed',
                    borderColor: previewUrl ? 'primary.main' : '#ccc',
                    borderRadius: '12px',
                    p: 2,
                    textAlign: 'center',
                    bgcolor: '#fafafa'
                }}>
                    {previewUrl ? (
                        <Box sx={{ position: 'relative' }}>
                            <img
                                src={previewUrl}
                                alt="Preview"
                                style={{ width: '100%', borderRadius: '8px', maxHeight: '250px', objectFit: 'cover' }}
                            />
                            <IconButton
                                onClick={() => { setPreviewUrl(null); setCroppedBlob(null); if(fileInputRef.current) fileInputRef.current.value=''; }}
                                sx={{ position: 'absolute', top: 8, right: 8, bgcolor: 'rgba(255,255,255,0.8)', '&:hover': { bgcolor: 'white' } }}
                                color="error"
                            >
                                <DeleteIcon />
                            </IconButton>
                        </Box>
                    ) : (
                        <Button
                            component="label"
                            variant="text"
                            startIcon={<UploadIcon />}
                            sx={{ py: 4, width: '100%', color: '#666' }}
                        >
                            Subir foto de la embarcación
                            <input
                                type="file" hidden
                                ref={fileInputRef}
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                        </Button>
                    )}
                </Box>

                {!isFormValid && (
                    <Alert severity="info" sx={{ borderRadius: '8px' }}>
                        Complete todos los campos requeridos para continuar.
                    </Alert>
                )}

                <Button
                    fullWidth type="submit"
                    variant="contained"
                    disabled={loading || !isFormValid}
                    sx={{
                        py: 1.5,
                        fontWeight: 'bold',
                        borderRadius: '8px',
                        bgcolor: vesselToEdit ? '#0d47a1' : '#2e7d32',
                        textTransform: 'none',
                        fontSize: '1rem',
                        '&:hover': { bgcolor: vesselToEdit ? '#0a3a82' : '#1b5e20' }
                    }}
                >
                    {loading ? <CircularProgress size={24} color="inherit" /> :
                        vesselToEdit ? 'Actualizar Embarcación' : 'Registrar Embarcación'}
                </Button>
            </Stack>

            {tempImageSrc && (
                <ImageCropper
                    imageSrc={tempImageSrc}
                    onCropComplete={handleCropComplete}
                    onCancel={() => setTempImageSrc(null)}
                />
            )}
        </Box>
    );
};