// src/store/userRequests/actions.ts
import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import api from '@/api/axiosClient';
import { ApiResponse } from '@/types/api';
import { UserRequest } from './types';

/**
 * Fetch danh sách các yêu cầu đang chờ xử lý.
 * API: GET /user-requests
 */
export const fetchPendingRequests = createAsyncThunk<UserRequest[]>(
    'userRequests/fetchPending',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get<ApiResponse<UserRequest[]>>('/user-requests');
            return response.data.data;
        } catch (err) {
            const error = err as AxiosError<{ message: string }>;
            return rejectWithValue(error.response?.data?.message || 'Không thể tải danh sách yêu cầu.');
        }
    }
);

/**
 * Phê duyệt một yêu cầu.
 * API: POST /user-requests/{requestId}/approve
 */
export const approveRequest = createAsyncThunk<number, number>( // Trả về ID của request đã xử lý
    'userRequests/approve',
    async (requestId, { rejectWithValue }) => {
        try {
            await api.post<ApiResponse<string>>(`/user-requests/${requestId}/approve`);
            return requestId;
        } catch (err) {
            const error = err as AxiosError<{ message: string }>;
            return rejectWithValue(error.response?.data?.message || 'Phê duyệt yêu cầu thất bại.');
        }
    }
);

/**
 * Từ chối một yêu cầu.
 * API: POST /user-requests/{requestId}/reject
 */
export const rejectRequest = createAsyncThunk<number, number>( // Trả về ID của request đã xử lý
    'userRequests/reject',
    async (requestId, { rejectWithValue }) => {
        try {
            await api.post<ApiResponse<string>>(`/user-requests/${requestId}/reject`);
            return requestId;
        } catch (err) {
            const error = err as AxiosError<{ message: string }>;
            return rejectWithValue(error.response?.data?.message || 'Từ chối yêu cầu thất bại.');
        }
    }
);