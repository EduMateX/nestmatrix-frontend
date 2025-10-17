import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/api/axiosClient';
import { ApiResponse } from '@/types/api';
import { DashboardData } from './types';
import { AxiosError } from 'axios';

export const fetchDashboardData = createAsyncThunk<DashboardData>(
    'dashboard/fetchData',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get<ApiResponse<DashboardData>>('/dashboard');
            return response.data.data;
        } catch (err) {
            const error = err as AxiosError<{ message: string }>;
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch dashboard data');
        }
    }
);