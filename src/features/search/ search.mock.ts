export interface SearchResponse {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
    items: Experience[];
}

export interface Experience {
    id: string;
    title: string;
    duration: string;
    price: number;
    originalPrice?: number;
    image: string;
    tag?: string;
}

const ALL_EXPERIENCES: Experience[] = [
    {
        id: '1',
        title: 'Paseo en bote tradicional por la bahía',
        duration: '4 horas',
        price: 45,
        originalPrice: 60,
        image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop',
        tag: 'Popular'
    },
    {
        id: '2',
        title: 'Taller de elaboración de ceviche',
        duration: '3 horas',
        price: 35,
        image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400&h=300&fit=crop'
    },
    {
        id: '3',
        title: 'Tour artesanal con pescadores locales',
        duration: '5 horas',
        price: 55,
        image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop'
    },
    {
        id: '4',
        title: 'Experiencia gastronómica frente al mar',
        duration: '2.5 horas',
        price: 40,
        image: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=400&h=300&fit=crop'
    },
    {
        id: '5',
        title: 'Pesca artesanal al amanecer',
        duration: '6 horas',
        price: 65,
        originalPrice: 80,
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop'
    },
    // duplicamos para simular muchas páginas
    ...Array.from({ length: 30 }).map((_, i) => ({
        id: `x-${i}`,
        title: `Experiencia costera ${i + 1}`,
        duration: '4 horas',
        price: 50 + i,
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=300&fit=crop'
    }))
];

export function mockSearchApi(
    page?: number,
    keyword?: string,
    pageSize = 9
): SearchResponse {
    // Aseguramos valores seguros
    const safePage = page && page > 0 ? page : 1;

    // Si el keyword es null, undefined o solo espacios, lo tratamos como vacío
    const safeKeyword = keyword?.trim().toLowerCase() || '';

    // LÓGICA DE FILTRADO:
    // Si no hay keyword, no filtramos (filt = ALL_EXPERIENCES)
    const filtered = safeKeyword !== ''
        ? ALL_EXPERIENCES.filter(e =>
            e.title.toLowerCase().includes(safeKeyword)
        )
        : [...ALL_EXPERIENCES]; // Copia del array original

    const totalItems = filtered.length;
    const totalPages = Math.ceil(totalItems / pageSize);

    // Evitar que la página solicitada exceda el total de páginas (si hay resultados)
    const activePage = totalPages > 0 && safePage > totalPages ? totalPages : safePage;

    const start = (activePage - 1) * pageSize;
    const end = start + pageSize;

    console.log('[API Debug]', {
        buscando: safeKeyword || 'Todo',
        pagina: activePage,
        resultados: totalItems
    });

    return {
        page: activePage,
        pageSize,
        totalItems,
        totalPages,
        items: filtered.slice(start, end)
    };
}

