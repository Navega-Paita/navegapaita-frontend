import type {CreatePackageDto} from "../../shared/dtos/package.dto.ts";
import type { PackageCardDto } from "../../shared/dtos/package-card.dto.ts";
import type {PackageDetailDto} from "../../shared/dtos/package-detail.dto.ts";

interface PaginatedResponse {
    items: PackageCardDto[];
    total: number;
    pages: number;
}

interface SearchFilters {
    page?: number;
    keyword?: string;
    date_range_from?: string;
    date_range_to?: string;
}

const API_URL = 'http://localhost:3000';

export const packageService = {

    createPackage: async (packageDto: CreatePackageDto): Promise<PackageCardDto> => {
        const response = await fetch(`${API_URL}/packages`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(packageDto)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Error al crear el paquete');
        }
        return await response.json();
    },

    getHomePackages: async (userId?: number): Promise<{
        uniqueExperiences: PackageCardDto[];
        newExperiences: PackageCardDto[];
        popularExperiences: PackageCardDto[];
    }> => {
        const url = userId ? `${API_URL}/packages/home?userId=${userId}` : `${API_URL}/packages/home`;
        const res = await fetch(url);
        if (!res.ok) throw new Error('Error al cargar home');
        return await res.json();
    },

    searchPackagesPaginated: async (params: SearchFilters, userId?: number): Promise<PaginatedResponse> => {
        const cleanParams: Record<string, string> = {};

        Object.entries(params).forEach(([key, value]) => {
            // Solo incluimos valores que existan y NO sean el string "undefined"
            if (value !== undefined && value !== null && value !== '' && value !== 'undefined') {
                cleanParams[key] = String(value);
            }
        });

        if (userId) cleanParams.userId = userId.toString();

        const queryParams = new URLSearchParams(cleanParams);
        const response = await fetch(`${API_URL}/packages/search?${queryParams.toString()}`);

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Error en la búsqueda');
        }

        return await response.json();
    },

    getPackageBySlug: async (slug: string, userId?: number): Promise<PackageDetailDto> => {
        const url = userId
            ? `${API_URL}/packages/${slug}?userId=${userId}`
            : `${API_URL}/packages/${slug}`;

        const response = await fetch(url);

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Paquete no encontrado');
        }

        return await response.json();
    },

    getPackageById: async (packageId: number | string): Promise<PackageDetailDto & { id: number }> => {
        const response = await fetch(`${API_URL}/packages/${packageId}`);

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Paquete no encontrado');
        }

        return await response.json();
    },

    deletePackage: async (packageId: number): Promise<void> => {
        const response = await fetch(`${API_URL}/packages/${packageId}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'No se pudo eliminar el paquete');
        }
    }
};