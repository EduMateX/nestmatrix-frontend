export enum ContractStatus {
    DRAFT = "DRAFT",
    WAITING_SIGNATURES = "WAITING_SIGNATURES",
    ACTIVE = "ACTIVE",
    EXPIRED = "EXPIRED",
    TERMINATED = "TERMINATED",
    PENDING_TERMINATION = "PENDING_TERMINATION"
}

export interface Contract {
    id: number;
    roomId: number;
    roomNumber: string;
    tenantId: number;
    tenantName: string;
    startDate: string; // 'YYYY-MM-DD'
    endDate: string;
    rentAmount: number;
    depositAmount: number;
    paymentCycle: number;
    status: ContractStatus;
    contractFileUrl?: string;
    tenantSignatureUrl?: string; // Thêm trường chữ ký
    tenantSignedAt?: string;
}

export interface ContractsState {
    items: Contract[];
    currentPage: number;
    totalPages: number;
    totalElements: number;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

export interface FetchContractsPayload {
    page: number;
    size: number;
    status?: ContractStatus;
}

// Kiểu dữ liệu cho form
export interface ContractFormData {
    roomId: number;
    tenantId: number;
    startDate: string;
    endDate: string;
    rentAmount: number;
    depositAmount: number;
    paymentCycle: number;
}

// DTO chứa dữ liệu được parse từ file hợp đồng
export interface ParsedContractData {
    tenantName: string | null;
    roomNumber: string | null;
    startDate: string | null; // 'YYYY-MM-DD'
    endDate: string | null;
    rentAmount: number | null;
    depositAmount: number | null;
    paymentCycle: number | null;
}

// Payload cho action upload file (bao gồm cả tùy chọn overwrite)
export interface UploadContractFilePayload {
    id: number;
    file: File;
    overwriteData: boolean;
}