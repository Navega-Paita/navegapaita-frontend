const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export interface CreateReviewPayload {
    userId: number;
    packageId: number;
    rating: number;
    comment?: string;
}

export const reviewsService = {
    async createOrUpdate(data: CreateReviewPayload) {
        const response = await fetch(`${API_URL}/reviews`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(error.message || 'Error al guardar la valoración');
        }
        return response.json();
    },

    async getByPackage(packageId: number) {
        const response = await fetch(`${API_URL}/reviews/package/${packageId}`);
        if (!response.ok) {
            throw new Error('Error al obtener las reseñas del paquete');
        }
        return response.json(); // Retorna { averageRating, totalReviews, reviews }
    },

    async getByUser(userId: number) {
        const response = await fetch(`${API_URL}/reviews/user/${userId}`);
        if (!response.ok) {
            throw new Error('Error al obtener tus reseñas');
        }
        return response.json();
    },
};