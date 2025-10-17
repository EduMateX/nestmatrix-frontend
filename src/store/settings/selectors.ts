import { RootState } from '@/store';

// Lấy toàn bộ danh sách cài đặt
export const selectAllSettings = (state: RootState) => state.settings.items;

// Lấy trạng thái loading/succeeded/failed của module
export const selectSettingsStatus = (state: RootState) => state.settings.status;

// Lấy thông tin lỗi (nếu có)
export const selectSettingsError = (state: RootState) => state.settings.error;