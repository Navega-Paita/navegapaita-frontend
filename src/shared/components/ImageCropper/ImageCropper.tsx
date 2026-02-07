import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { getCroppedImg } from './cropImageHelper';

interface ImageCropperProps {
    imageSrc: string;
    onCropComplete: (croppedBlob: Blob) => void;
    onCancel: () => void;
}

export const ImageCropper: React.FC<ImageCropperProps> = ({ imageSrc, onCropComplete, onCancel }) => {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

    const onCropAreaComplete = useCallback((_: any, pixels: any) => {
        setCroppedAreaPixels(pixels);
    }, []);

    const handleSave = async () => {
        try {
            const blob = await getCroppedImg(imageSrc, croppedAreaPixels);
            onCropComplete(blob);
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 50, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ position: 'relative', width: '90%', maxWidth: '600px', height: '400px', backgroundColor: '#333' }}>
                <Cropper
                    image={imageSrc}
                    crop={crop}
                    zoom={zoom}
                    aspect={16 / 9}
                    onCropChange={setCrop}
                    onZoomChange={setZoom}
                    onCropComplete={onCropAreaComplete}
                />
            </div>
            <div style={{ marginTop: '20px', display: 'flex', gap: '10px', alignItems: 'center' }}>
                <input
                    type="range"
                    value={zoom}
                    min={1}
                    max={3}
                    step={0.1}
                    onChange={(e) => setZoom(Number(e.target.value))}
                />
                <button type="button" onClick={onCancel} style={{ padding: '8px 16px', backgroundColor: 'white', border: 'none', borderRadius: '4px' }}>Cancelar</button>
                <button type="button" onClick={handleSave} style={{ padding: '8px 16px', backgroundColor: '#0084FF', color: 'white', border: 'none', borderRadius: '4px' }}>Guardar Recorte</button>
            </div>
        </div>
    );
};