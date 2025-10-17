export enum NotificationType {
    SYSTEM_GENERAL = "SYSTEM_GENERAL",
    NEW_INVOICE = "NEW_INVOICE",
    INVOICE_REMINDER = "INVOICE_REMINDER",
    PAYMENT_CONFIRMED = "PAYMENT_CONFIRMED",
    CONTRACT_EXPIRING_SOON = "CONTRACT_EXPIRING_SOON",
    ADMIN_ANNOUNCEMENT = "ADMIN_ANNOUNCEMENT",
    MAINTENANCE_SCHEDULE = "MAINTENANCE_SCHEDULE",
    NEW_INCIDENT_REPORTED = "NEW_INCIDENT_REPORTED",
    INCIDENT_STATUS_UPDATED = "INCIDENT_STATUS_UPDATED"
}

export interface Notification {
    id: number;
    type: NotificationType;
    message: string;
    link?: string;
    isRead: boolean;
    createdAt: string; // ISO Date String
}

export interface NotificationsState {
    items: Notification[];
    unreadCount: number;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
    // Thêm thông tin phân trang nếu cần cho trang "Tất cả thông báo"
    currentPage: number;
    totalPages: number;
}