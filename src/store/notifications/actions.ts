import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/api/axiosClient';
import { ApiResponse, Page } from '@/types/api';
import { Notification } from './types';


// Fetch notifications (phân trang)
export const fetchNotifications = createAsyncThunk<Page<Notification>, { page: number, size: number }>(
    'notifications/fetch',
    async ({ page, size }, { rejectWithValue }) => {
        try {
            const response = await api.get<ApiResponse<Page<Notification>>>(`/notifications?page=${page}&size=${size}`);
            return response.data.data;
        } catch (err) {
            return rejectWithValue('Failed to fetch notifications');
        }
    }
);

// Fetch unread count
export const fetchUnreadCount = createAsyncThunk<number>(
    'notifications/fetchUnreadCount',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get<ApiResponse<number>>('/notifications/unread-count');
            return response.data.data;
        } catch (err) {
            return rejectWithValue('Failed to fetch unread count');
        }
    }
);

// Mark a notification as read
export const markNotificationAsRead = createAsyncThunk<number, number>( // Trả về ID của noti
    'notifications/markAsRead',
    async (id, { rejectWithValue }) => {
        try {
            await api.put(`/notifications/${id}/read`);
            return id;
        } catch (err) {
            return rejectWithValue('Failed to mark notification as read');
        }
    }
);