export enum ContractStatus {
    ACTIVE = "ACTIVE",
    EXPIRED = "EXPIRED",
    TERMINATED = "TERMINATED"
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