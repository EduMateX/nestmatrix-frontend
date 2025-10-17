export interface Tenant {
    id: number;
    fullName: string;
    dateOfBirth?: string; // Sử dụng string cho date để dễ dàng serialize
    phoneNumber: string;
    email?: string;
    citizenId: string;
    citizenIdImageUrl?: string;
    permanentAddress?: string;
}

export interface TenantsState {
    items: Tenant[];
    currentPage: number;
    totalPages: number;
    totalElements: number;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

export interface FetchTenantsPayload {
    page: number;
    size: number;
    keyword?: string;
}

// Kiểu dữ liệu cho form
export interface TenantFormData {
    fullName: string;
    dateOfBirth?: string;
    phoneNumber: string;
    email?: string;
    citizenId: string;
    permanentAddress?: string;
    password?: string;
    image?: File;
}

export interface CreateTenantPayload extends TenantFormData { }

export interface UpdateTenantPayload extends TenantFormData {
    id: number;
}