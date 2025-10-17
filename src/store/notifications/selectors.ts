import { RootState } from '@/store';
import { createSelector } from '@reduxjs/toolkit';

// Lấy toàn bộ danh sách thông báo hiện có trong state
export const selectAllNotifications = (state: RootState) => state.notifications.items;

// Lấy trạng thái loading/succeeded/failed
export const selectNotificationsStatus = (state: RootState) => state.notifications.status;

// Lấy số lượng thông báo chưa đọc
export const selectUnreadCount = (state: RootState) => state.notifications.unreadCount;

// Lấy thông tin lỗi (nếu có)
export const selectNotificationsError = (state: RootState) => state.notifications.error;

// Selector đã được memoize để lấy thông tin phân trang
export const selectNotificationsPagination = createSelector(
    (state: RootState) => state.notifications.currentPage,
    (state: RootState) => state.notifications.totalPages,
    (currentPage, totalPages) => ({
        currentPage,
        totalPages,
    })
);