import { Box } from "@mui/material";
import { useState } from "react";
import "./Gallery.css";
import type { CloudinaryImage } from "../../../shared/models/cloudinary.model.ts";

export default function Gallery({ images }: { images: CloudinaryImage[] }) {
    const [main, setMain] = useState<CloudinaryImage>(images[0]);

    if (!images || images.length === 0) {
        return <Box className="gallery-empty">No hay imágenes disponibles</Box>;
    }

    return (
        <Box className="gallery">
            <img src={main.url} alt="Imagen principal" className="gallery-main" />

            <Box className="gallery-thumbs">
                {images.map((img) => (
                    <img
                        key={img.publicId}
                        src={img.url}
                        className={`thumb ${main.publicId === img.publicId ? 'active' : ''}`}
                        onClick={() => setMain(img)}
                        alt="Miniatura"
                    />
                ))}
            </Box>
        </Box>
    );
}
