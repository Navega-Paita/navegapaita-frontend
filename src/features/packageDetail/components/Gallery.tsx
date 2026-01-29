import { Box } from "@mui/material";
import { useState } from "react";
import "./Gallery.css";

export default function Gallery({ images }: { images: string[] }) {
    const [main, setMain] = useState(images[0]);

    return (
        <Box className="gallery">
            <img src={main} className="gallery-main" />
            <Box className="gallery-thumbs">
                {images.map((img, i) => (
                    <img key={i} src={img} onClick={() => setMain(img)} />
                ))}
            </Box>
        </Box>
    );
}
