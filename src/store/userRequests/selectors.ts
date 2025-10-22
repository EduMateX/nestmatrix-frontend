import { RootState } from '@/store';

// Lấy danh sách các yêu cầu đang chờ
export const selectAllUserRequests = (state: RootState) => state.userRequests.items;

// Lấy trạng thái của module (loading, etc.)
export const selectUserRequestsStatus = (state: RootState) => state.userRequests.status;

// Lấy lỗi (nếu có)
export const selectUserRequestsError = (state: RootState) => state.userRequests.error;