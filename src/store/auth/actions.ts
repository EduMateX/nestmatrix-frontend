
import { createAsyncThunk } from '@reduxjs/toolkit';
import { UserProfile } from './types';
import { AxiosError } from 'axios';
import axiosClient from '@/api/axiosClient';
import { ApiResponse } from '@/types/api';

// Kiểu dữ liệu cho payload của action login
export interface LoginPayload {
    email: string;
    password: string;
}

// Action để lấy thông tin người dùng hiện tại
export const fetchUserProfile = createAsyncThunk<UserProfile, void, { rejectValue: string }>(
    'auth/fetchUserProfile',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosClient.get<ApiResponse<UserProfile>>('/users/profile');
            return response.data.data;
        } catch (err) {
            const error = err as AxiosError<{ message: string }>;
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch user profile');
        }
    }
);

// Action chính để đăng nhập
export const loginAction = createAsyncThunk<UserProfile, LoginPayload, { rejectValue: string }>(
    'auth/login',
    async (loginData, { dispatch, rejectWithValue }) => {
        try {
            await axiosClient.post('/auth/login', loginData);

            const userProfileResult = await dispatch(fetchUserProfile());

            if (fetchUserProfile.fulfilled.match(userProfileResult)) {
                return userProfileResult.payload;
            } else {
                const errorPayload = userProfileResult.payload || 'Failed to fetch profile after login';
                throw new Error(errorPayload);
            }
        } catch (err) {
            // SỬA LỖI 2 (lặp lại): Gán kiểu cho error và kiểm tra
            const error = err as AxiosError<{ message: string }>;
            return rejectWithValue(error.response?.data?.message || (err as Error).message || 'Invalid credentials');
        }
    }
);

// Action để đăng xuất
export const logoutAction = createAsyncThunk<void, void, { rejectValue: string }>(
    'auth/logout',
    async (_, { rejectWithValue }) => {
        try {
            await axiosClient.post('/auth/logout');
        } catch (err) {
            const error = err as AxiosError<{ message: string }>;
            return rejectWithValue(error.response?.data?.message || 'Logout failed');
        }
    }
);