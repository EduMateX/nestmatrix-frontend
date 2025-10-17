import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/api/axiosClient';
import { ApiResponse } from '@/types/api';
import { SystemSetting, UpdateSettingsPayload } from './types';
import { AxiosError } from 'axios';

// Fetch all settings
export const fetchSettings = createAsyncThunk<SystemSetting[]>(
    'settings/fetchSettings',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get<ApiResponse<SystemSetting[]>>('/settings');
            return response.data.data;
        } catch (err) {
            const error = err as AxiosError<{ message: string }>;
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch settings');
        }
    }
);

// Update settings
export const updateSettings = createAsyncThunk<void, UpdateSettingsPayload>(
    'settings/updateSettings',
    async (settings, { rejectWithValue }) => {
        try {
            await api.put<ApiResponse<string>>('/settings', settings);
        } catch (err) {
            const error = err as AxiosError<{ message: string }>;
            return rejectWithValue(error.response?.data?.message || 'Failed to update settings');
        }
    }
);