import React, { useState, useRef } from 'react';
import { cloudinaryService } from "../../core/services/cloudinary.service.ts";
import type { CreatePackageDto } from "../../shared/dtos/package.dto.ts";
import { ImageCropper } from '../../shared/components/ImageCropper/ImageCropper';

export const PackageForm: React.FC = () => {
    const [title, setTitle] = useState('');
    const [loading, setLoading] = useState(false);

    // Imágenes finales ya recortadas (Blobs)
    const [croppedImages, setCroppedImages] = useState<Blob[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);

    // Gestión de la "cola" de procesamiento
    const [filesToProcess, setFilesToProcess] = useState<string[]>([]);
    const [isCropping, setIsCropping] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const filesArray = Array.from(e.target.files);
            // Convertimos los archivos a URLs temporales para que el Cropper los lea
            const urls = filesArray.map(file => URL.createObjectURL(file));
            setFilesToProcess(urls);
            setIsCropping(true); // Abrimos el modal para la primera imagen
        }
    };

    const handleCropComplete = (blob: Blob) => {
        // 1. Guardamos el recorte actual
        setCroppedImages(prev => [...prev, blob]);
        setPreviews(prev => [...prev, URL.createObjectURL(blob)]);

        // 2. Pasamos a la siguiente imagen de la cola
        const remaining = filesToProcess.slice(1);
        setFilesToProcess(remaining);

        // 3. Si ya no hay más, cerramos el modal
        if (remaining.length === 0) {
            setIsCropping(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const slug = title.toLowerCase().replace(/\s+/g, '-');

            // Subida masiva a Cloudinary
            const uploadPromises = croppedImages.map((blob, index) =>
                cloudinaryService.uploadImage(blob, `pkg_${slug}_${index}_${Date.now()}`)
            );

            const uploadedImages = await Promise.all(uploadPromises);

            const payload: CreatePackageDto = {
                title,
                slug,
                description: "Descripción del paquete",
                imageGallery: uploadedImages,
            };

            console.log("Payload enviado:", payload);
            alert(`¡Éxito! Se subieron ${uploadedImages.length} imágenes.`);

            // Reset
            setCroppedImages([]);
            setPreviews([]);
            setTitle('');
        } catch (error) {
            console.error(error);
            alert("Error en el proceso");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
            <form onSubmit={handleSubmit}>
                <h2>Nuevo Paquete Turístico</h2>
                <input
                    type="text"
                    placeholder="Título del Paquete"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    style={{ width: '100%', padding: '10px', marginBottom: '20px' }}
                />

                <div style={{ border: '2px dashed #ccc', padding: '20px', textAlign: 'center', marginBottom: '20px' }}>
                    <p>Paso 1: Selecciona todas las fotos</p>
                    <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleFileChange}
                        ref={fileInputRef}
                    />
                </div>

                {/* Galería de Previews ya recortados */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                    {previews.map((url, i) => (
                        <img key={i} src={url} style={{ width: '100%', borderRadius: '8px', border: '2px solid #ddd' }} />
                    ))}
                </div>

                {/* Modal del Cropper (Se muestra si hay archivos en cola) */}
                {isCropping && filesToProcess.length > 0 && (
                    <ImageCropper
                        imageSrc={filesToProcess[0]} // Siempre procesa la primera de la cola
                        onCropComplete={handleCropComplete}
                        onCancel={() => {
                            setIsCropping(false);
                            setFilesToProcess([]);
                        }}
                    />
                )}

                <button
                    type="submit"
                    disabled={loading || croppedImages.length === 0}
                    style={{ marginTop: '20px', padding: '15px 30px', backgroundColor: 'green', color: 'white', border: 'none', cursor: 'pointer' }}
                >
                    {loading ? 'Subiendo...' : `GUARDAR PAQUETE (${croppedImages.length} FOTOS)`}
                </button>
            </form>
        </div>
    );
};