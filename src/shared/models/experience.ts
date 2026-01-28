// types/experience.ts
export interface Experience {
    id: string; // Siempre es bueno tener un ID
    image: string;
    title: string;
    duration: string;
    price: number;
    originalPrice?: number;
    tag?: string;
    location?: string; // Ejemplo de expansión futura
}