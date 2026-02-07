import React, { useState } from 'react';
import { vesselService} from "../../core/services/vessel.service.ts";
import type { CreateVesselDto } from "../../shared/dtos/vessel.dto.ts";
import { ImageCropper } from '../../shared/components/ImageCropper/ImageCropper.tsx';

export const VesselForm: React.FC = () => {
    const [formData, setFormData] = useState<CreateVesselDto>({
        name: '',
        registrationNumber: '',
        type: '',
        capacity: 0,
        technicalSpecs: '',
        ownerId: 1, // ID del pescador logueado
    });

    const [loading, setLoading] = useState(false);
    const [tempImageSrc, setTempImageSrc] = useState<string | null>(null);
    const [croppedBlob, setCroppedBlob] = useState<Blob | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const reader = new FileReader();
            reader.onload = () => setTempImageSrc(reader.result as string);
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    const handleCropComplete = (blob: Blob) => {
        setCroppedBlob(blob);
        setPreviewUrl(URL.createObjectURL(blob));
        setTempImageSrc(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validación preventiva: si el modal del cropper está abierto, no dejar enviar
        if (tempImageSrc) return;

        setLoading(true);
        try {
            await vesselService.registerVesselFull(formData, croppedBlob);
            alert("Embarcación registrada correctamente");

            // Limpiar el preview después de un registro exitoso
            setPreviewUrl(null);
            setCroppedBlob(null);

        } catch (error) {
            alert("Error al registrar");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px', maxWidth: '500px' }}>
            <input type="text" placeholder="Nombre" required onChange={e => setFormData({...formData, name: e.target.value})} />
            <input type="text" placeholder="Matrícula" required onChange={e => setFormData({...formData, registrationNumber: e.target.value})} />
            <input type="text" placeholder="Tipo" required onChange={e => setFormData({...formData, type: e.target.value})} />
            <input type="number" placeholder="Capacidad" required onChange={e => setFormData({...formData, capacity: Number(e.target.value)})} />
            <textarea placeholder="Especificaciones" onChange={e => setFormData({...formData, technicalSpecs: e.target.value})} />

            <div style={{ border: '2px dashed #ccc', padding: '20px', textAlign: 'center' }}>
                {previewUrl && <img src={previewUrl} alt="Preview" style={{ width: '100%', aspectRatio: '16/9', objectFit: 'cover' }} />}
                <input type="file" accept="image/*" onChange={handleFileChange} />
            </div>

            {tempImageSrc && (
                <ImageCropper
                    imageSrc={tempImageSrc}
                    onCropComplete={handleCropComplete}
                    onCancel={() => setTempImageSrc(null)}
                />
            )}

            <button type="submit" disabled={loading} style={{ backgroundColor: 'green', color: 'white', padding: '10px' }}>
                {loading ? 'Procesando...' : 'REGISTRAR EMBARCACIÓN'}
            </button>
        </form>
    );
};