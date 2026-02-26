import type { CloudinaryImage} from "./cloudinary.model.ts";
import type { User } from "./user.model.ts";

export interface Vessel {
    id: number;
    name: string;
    registrationNumber: string;
    type: string;
    capacity: number;
    technicalSpecs?: string;
    status: string;
    image?: CloudinaryImage;
    owner?: User;
}