
/**
 * Enum cho trạng thái hóa đơn.
 */
export enum InvoiceStatus {
    PENDING = "PENDING",                     // Chờ thanh toán
    WAITING_CONFIRMATION = "WAITING_CONFIRMATION", // Chờ xác nhận
    PAID = "PAID",                           // Đã thanh toán
    OVERDUE = "OVERDUE"                      // Quá hạn
}

/**
 * Enum cho các loại dịch vụ trong chi tiết hóa đơn.
 */
export enum ServiceType {
    ELECTRICITY = "ELECTRICITY",
    WATER = "WATER",
    INTERNET = "INTERNET",
    CLEANING = "CLEANING",
    PARKING = "PARKING",
    OTHER = "OTHER"
}

export interface InvoiceDetail {
    id: number;
    serviceType: ServiceType;
    description: string;
    amount: number;
}

export interface Invoice {
    id: number;
    contractId: number;
    roomId: number;
    roomNumber: string;
    tenantId: number;
    tenantName: string;
    issueDate: string;
    dueDate: string;
    periodMonth: number;
    periodYear: number;
    totalAmount: number;
    status: InvoiceStatus;
    paymentReceiptUrl?: string;
    paymentDate?: string;
    details: InvoiceDetail[];
}

export interface InvoicesState {
    items: Invoice[];
    currentPage: number;
    totalPages: number;
    totalElements: number;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

export interface FetchInvoicesPayload {
    page: number;
    size: number;
    buildingId?: number;
    roomId?: number;
    status?: InvoiceStatus;
    // Thêm các filter khác nếu cần
}