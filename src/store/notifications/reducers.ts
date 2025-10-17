// src/store/notifications/reducers.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { NotificationsState, Notification } from './types';
import { fetchNotifications, fetchUnreadCount, markNotificationAsRead } from './actions';

const initialState: NotificationsState = {
    items: [],
    unreadCount: 0,
    status: 'idle',
    error: null,
    currentPage: 0,
    totalPages: 0,
};

const notificationsSlice = createSlice({
    name: 'notifications',
    initialState,
    reducers: {
        // Action được gọi bởi WebSocket để tăng số lượng chưa đọc
        incrementUnreadCount: (state) => {
            state.unreadCount += 1;
        },
        // Action được gọi bởi WebSocket để thêm thông báo mới vào đầu danh sách
        addNotification: (state, action: PayloadAction<Partial<Notification>>) => {
            // Chuyển đổi Partial<Notification> thành Notification đầy đủ
            const newNotification = {
                id: action.payload.id || Date.now(),
                type: action.payload.type!,
                message: action.payload.message!,
                link: action.payload.link,
                isRead: false,
                createdAt: action.payload.createdAt || new Date().toISOString(),
            };
            state.items.unshift(newNotification);
        },
        // Action để reset state khi người dùng đăng xuất
        resetNotifications: () => initialState,
    },
    extraReducers: (builder) => {
        builder
            // Fetch Notifications (danh sách)
            .addCase(fetchNotifications.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchNotifications.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload.content;
                state.currentPage = action.payload.number;
                state.totalPages = action.payload.totalPages;
            })
            .addCase(fetchNotifications.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            })

            // Fetch Unread Count
            .addCase(fetchUnreadCount.fulfilled, (state, action) => {
                state.unreadCount = action.payload;
            })

            // Mark as Read
            .addCase(markNotificationAsRead.fulfilled, (state, action) => {
                // Tìm thông báo trong danh sách
                const notification = state.items.find(item => item.id === action.payload);
                if (notification && !notification.isRead) {
                    notification.isRead = true;
                    // Giảm số lượng chưa đọc, đảm bảo không âm
                    state.unreadCount = Math.max(0, state.unreadCount - 1);
                }
            });
    },
});

export const { incrementUnreadCount, addNotification, resetNotifications } = notificationsSlice.actions;
export default notificationsSlice.reducer;