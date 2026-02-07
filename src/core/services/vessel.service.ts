import type { CreateVesselDto } from "../../shared/dtos/vessel.dto.ts";
import { cloudinaryService } from "./cloudinary.service.ts";
import type { CloudinaryImage } from "../../shared/models/cloudinary.model.ts";

const API_URL = 'http://localhost:3000';

export const vesselService = {
    /**
     * Registra la embarcación en nuestro Backend NestJS (RF2.1)
     */
    createVessel: async (vesselData: CreateVesselDto): Promise<void> => {
        console.log("LOG [vesselService.createVessel]: Enviando a NestJS...", vesselData);

        const response = await fetch(`${API_URL}/vessels`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(vesselData),
        });

        if (!response.ok) {
            const errorBody = await response.json();
            console.error("LOG [vesselService.createVessel]: Error Backend:", errorBody);
            throw new Error(errorBody.message || 'Error en el servidor');
        }

        console.log("LOG [vesselService.createVessel]: Éxito en DB");
    },

    /**
     * Orquestador: Sube foto usando el servicio compartido y registra en DB
     */
    registerVesselFull: async (data: CreateVesselDto, imageBlob: Blob | null): Promise<void> => {
        console.log("LOG [registerVesselFull]: Inicio de proceso");

        // Definimos la variable con el tipo correcto de tu modelo
        let cloudinaryData: CloudinaryImage | undefined = undefined;

        if (imageBlob) {
            try {
                console.log("LOG [registerVesselFull]: Intentando subir a Cloudinary...");

                // Limpiamos la matrícula para el public_id (evitando caracteres raros)
                const customName = `vessel_${data.registrationNumber.trim().replace(/[^a-zA-Z0-9]/g, '_')}`;

                // El servicio ahora devuelve { url, publicId }
                cloudinaryData = await cloudinaryService.uploadImage(imageBlob, customName);

                console.log("LOG [registerVesselFull]: Datos de Cloudinary obtenidos:", cloudinaryData);
            } catch (error) {
                console.error("LOG [registerVesselFull]: Falló Cloudinary:", error);
                throw error;
            }
        }

        // Armamos el payload final respetando estrictamente tu CreateVesselDto
        const finalPayload: CreateVesselDto = {
            name: data.name,
            registrationNumber: data.registrationNumber,
            type: data.type,
            capacity: data.capacity,
            technicalSpecs: data.technicalSpecs,
            ownerId: data.ownerId,
            image: cloudinaryData, // Asignamos el objeto { url, publicId }
        };

        console.log("LOG [registerVesselFull]: Payload final listo para NestJS:", finalPayload);

        return await vesselService.createVessel(finalPayload);
    }
};