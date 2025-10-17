import { RootState } from '@/store';

// Lấy toàn bộ danh sách lịch sử đang được lưu trong state
export const selectAllMeterReadings = (state: RootState) => state.meterReadings.items;

// Lấy trạng thái loading/succeeded/failed của module
export const selectMeterReadingsStatus = (state: RootState) => state.meterReadings.status;

// Lấy lỗi (nếu có)
export const selectMeterReadingsError = (state: RootState) => state.meterReadings.error;