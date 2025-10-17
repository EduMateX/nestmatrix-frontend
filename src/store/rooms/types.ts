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
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}