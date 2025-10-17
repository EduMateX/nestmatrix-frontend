export interface SystemSetting {
    key: string;
    value: string;
    description: string;
}

export interface SettingsState {
    items: SystemSetting[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

// Kiểu dữ liệu cho payload khi cập nhật
export type UpdateSettingsPayload = Record<string, string>; // Ví dụ: { "PRICE_ELECTRICITY": "4000" }