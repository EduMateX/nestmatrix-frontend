export interface Building {
    id: number;
    name: string;
    address: string;
    imageUrl?: string;
}

export interface BuildingsState {
    items: Building[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;

    currentPage: number;
    totalPages: number;
    totalElements: number;
}

// Kiểu dữ liệu cho việc tạo mới (không cần id, imageUrl)
export type CreateBuildingPayload = Omit<Building, 'id' | 'imageUrl'> & { image?: File };
// Kiểu dữ liệu cho việc cập nhật (id là bắt buộc)
export type UpdateBuildingPayload = Omit<Building, 'imageUrl'> & { image?: File };

export interface FetchBuildingsPayload {
    page: number;
    size: number;
    keyword?: string;
}