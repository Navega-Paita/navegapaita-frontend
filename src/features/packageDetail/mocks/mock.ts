// src/features/packageDetail/mock.ts
import type { Package } from "../../../shared/models/package.ts";

export const mockPackage: Package = {
    id: 1,
    title: "Paseo en bote tradicional por la bahía de Paita",
    slug: "paseo-bote-tradicional-bahia-paita",
    description: `
Una experiencia auténtica para descubrir la bahía de Paita a bordo de un bote tradicional,
guiado por pescadores locales que compartirán historias, costumbres y paisajes únicos.
Incluye navegación costera, avistamiento de fauna marina y una degustación gastronómica
frente al mar.
  `,
    type:"Paseo",
    duration: "4 horas",
    meals: "1 almuerzo marino",
    transport: "Bote artesanal motorizado",
    minAge: 6,
    groupSize: 12,
    price: 50,
    discount: 10,
    destinations: ["Paita", "Islotes costeros", "Caleta La Islilla"],
    imageGallery: [
        {
            url: "https://images.unsplash.com/photo-1559827260-dc66d52bef19",
            publicId: "mock/paita_bay_1"
        },
        {
            url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
            publicId: "mock/paita_bay_2"
        },
        {
            url: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
            publicId: "mock/paita_bay_3"
        },
        {
            url: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438",
            publicId: "mock/paita_bay_4"
        },
        {
            url: "https://images.unsplash.com/photo-1501785888041-af3ef285b470",
            publicId: "mock/paita_bay_5"
        }
    ],
    itinerary: [
        {
            title: "Bienvenida y salida desde el muelle",
            description:
                "Recepción del grupo, charla de seguridad y salida en bote por la bahía de Paita.",
            includedActivities: [
                "Charla de seguridad",
                "Navegación costera guiada",
                "Avistamiento de aves marinas"
            ],
            optionalActivities: [
                "Fotografía profesional a bordo - USD 10",
                "Bebidas premium - USD 5"
            ]
        },
        {
            title: "Zona de pesca artesanal",
            description:
                "Visita a las redes de pesca, demostración de técnicas tradicionales y contacto con pescadores locales.",
            includedActivities: [
                "Demostración de pesca artesanal",
                "Interacción cultural con pescadores",
                "Historia local de la bahía"
            ],
            optionalActivities: [
                "Participación activa en faena de pesca - USD 15"
            ]
        },
        {
            title: "Degustación gastronómica frente al mar",
            description:
                "Almuerzo típico a base de pescado fresco preparado al estilo local.",
            includedActivities: [
                "Degustación de ceviche",
                "Bebidas refrescantes",
                "Tiempo libre para fotografías"
            ],
            optionalActivities: [
                "Menú premium con mariscos - USD 20"
            ]
        }
    ],
    availability: [
        {
            startDate: "2026-02-07",
            endDate: "2026-02-07",
            spaceLeft: 2,
        },
        {
            startDate: "2026-02-14",
            endDate: "2026-02-14",
            spaceLeft: 0,
        },
        {
            startDate: "2026-03-05",
            endDate: "2026-03-05",
            spaceLeft: 6,
        },
        {
            startDate: "2026-03-20",
            endDate: "2026-03-20",
            spaceLeft: 10,
        }
    ]
};
