import React, {useEffect, useState} from 'react';
import { vesselService} from "../../core/services/vessel.service.ts";
import type { CreateVesselDto } from "../../shared/dtos/vessel.dto.ts";
import { ImageCropper } from '../../shared/components/ImageCropper/ImageCropper.tsx';

const initialFormState: CreateVesselDto = {
    name: '',
    registrationNumber: '',
    type: '',
    capacity: 0,
    technicalSpecs: '',
    ownerId: 1,
};

interface VesselFormProps {
    onSuccess?: () => void;
    vesselToEdit?: any; // Añadimos esta prop
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

    useEffect(() => {
        vesselService.getOwners().then(setOwners);
    }, []);

    // Creamos una referencia para el input de archivo
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const resetForm = () => {
        setFormData(initialFormState);
        setPreviewUrl(null);
        setCroppedBlob(null);
        if (previewUrl) URL.revokeObjectURL(previewUrl);

        // Limpiamos el input de archivo manualmente
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const reader = new FileReader();
            reader.onload = () => setTempImageSrc(reader.result as string);
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    const handleCropComplete = (blob: Blob) => {
        // Si ya existía una URL previa, la liberamos
        if (previewUrl) URL.revokeObjectURL(previewUrl);

        const url = URL.createObjectURL(blob);
        setCroppedBlob(blob);
        setPreviewUrl(url);
        setTempImageSrc(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (vesselToEdit) {
                // Lógica de Edición (Asumiendo que crearemos este método en el service)
                await vesselService.updateVessel(vesselToEdit.id, formData);
                alert("Actualizado correctamente");
            } else {
                // Lógica de Registro (Existente)
                await vesselService.registerVesselFull(formData, croppedBlob);
                alert("Registrado correctamente");
            }
            if (onSuccess) onSuccess();
        } catch (error) {
            console.error(error);
            alert("Error en la operación");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px', maxWidth: '500px' }}>
            <input type="text" placeholder="Nombre" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
            <input type="text" placeholder="Matrícula" required value={formData.registrationNumber} onChange={e => setFormData({...formData, registrationNumber: e.target.value})} />
            <input type="text" placeholder="Tipo" required value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} />
            <input type="number" placeholder="Capacidad" required value={formData.capacity || ''} onChange={e => setFormData({...formData, capacity: Number(e.target.value)})} />
            <textarea placeholder="Especificaciones" value={formData.technicalSpecs || ''} onChange={e => setFormData({...formData, technicalSpecs: e.target.value})} />

            <select
                required
                value={formData.ownerId}
                onChange={e => setFormData({...formData, ownerId: Number(e.target.value)})}
                style={{ padding: '10px', borderRadius: '4px' }}
            >
                <option value="">Seleccione un dueño (Pescador)</option>
                {owners.map(o => (
                    <option key={o.id} value={o.id}>{o.firstName} {o.lastName}</option>
                ))}
            </select>

            <div style={{ border: '2px dashed #ccc', padding: '20px', textAlign: 'center' }}>
                {previewUrl && (
                    <div style={{ marginBottom: '10px' }}>
                        <img src={previewUrl} alt="Preview" style={{ width: '100%', aspectRatio: '16/9', objectFit: 'cover' }} />
                        <button type="button" onClick={() => { setPreviewUrl(null); setCroppedBlob(null); if(fileInputRef.current) fileInputRef.current.value=''; }} style={{ color: 'red', cursor: 'pointer', border: 'none', background: 'none' }}>Eliminar foto</button>
                    </div>
                )}
                <input
                    type="file"
                    ref={fileInputRef} // Referencia para limpiar
                    accept="image/*"
                    onChange={handleFileChange}
                />
            </div>

            {tempImageSrc && (
                <ImageCropper
                    imageSrc={tempImageSrc}
                    onCropComplete={handleCropComplete}
                    onCancel={() => setTempImageSrc(null)}
                />
            )}

            <button type="submit" disabled={loading} style={{ backgroundColor: vesselToEdit ? '#1976d2' : 'green', color: 'white', padding: '10px' }}>
                {loading ? 'Procesando...' : vesselToEdit ? 'ACTUALIZAR DATOS' : 'REGISTRAR EMBARCACIÓN'}
            </button>
        </form>
    );
};