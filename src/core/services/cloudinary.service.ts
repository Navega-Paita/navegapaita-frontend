import type {CloudinaryImage} from "../../shared/models/cloudinary.model.ts";

const CLOUD_NAME = 'detiynwbm'; // Cambia esto por tu nombre de Cloud
const UPLOAD_PRESET = 'vessels_preset'; // Cambia esto por tu preset
const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

export const cloudinaryService = {
    /**
     * Sube un Blob o File a Cloudinary y retorna la URL segura.
     */
    uploadImage: async (imageBlob: Blob, customName: string): Promise<CloudinaryImage> => {
        const formData = new FormData();
        formData.append('file', imageBlob);
        formData.append('upload_preset', UPLOAD_PRESET || '');
        formData.append('public_id', customName);

        try {
            const response = await fetch(CLOUDINARY_URL, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Cloudinary Error Detail:', errorData);
                throw new Error(errorData.error?.message || 'Error al subir imagen a Cloudinary');
            }

            const data = await response.json();

            // AQUÍ CORREGIMOS EL RETORNO:
            // Devolvemos el objeto que cumple con la interfaz CloudinaryImage
            return {
                url: data.secure_url,
                publicId: data.public_id
            };

        } catch (error) {
            console.error('Cloudinary Service Error:', error);
            throw error;
        }
    }
};