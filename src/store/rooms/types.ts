export enum RoomStatus {
    AVAILABLE = "AVAILABLE",
    RENTED = "RENTED",
    MAINTENANCE = "MAINTENANCE"
}

export interface Room {
    id: number;
    roomNumber: string;
    price: number;
    area: number;
    imageUrl?: string;
    status: RoomStatus;
    buildingId: number;
}

export interface RoomsState {
    items: Room[];
    currentPage: number;
    totalPages: number;
    totalElements: number;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

export interface FetchRoomsPayload {
    page: number;
    size: number;
    buildingId?: number;
    status?: RoomStatus;
    keyword?: string;
}

export interface RoomFormData {
    roomNumber: string;
    buildingId: number;
    price: number;
    area: number;
    image?: File;
}

export interface CreateRoomPayload extends RoomFormData { }

export interface UpdateRoomPayload extends RoomFormData {
    id: number;
}