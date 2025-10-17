import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/api/axiosClient';
import { ApiResponse } from '@/types/api';
import { MeterReading, RecordReadingPayload } from './types';
import { AxiosError } from 'axios';

// Action để lấy lịch sử ghi chỉ số của một phòng cụ thể
export const fetchMeterReadingsByRoom = createAsyncThunk<MeterReading[], number>(
    'meterReadings/fetchByRoom',
    async (roomId, { rejectWithValue }) => {
        try {
            const response = await api.get<ApiResponse<MeterReading[]>>(`/rooms/${roomId}/meter-readings`);
            return response.data.data;
        } catch (err) {
            const error = err as AxiosError<{ message: string }>;
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch meter readings');
        }
    }
);

// Action để ghi một chỉ số mới
export const recordMeterReading = createAsyncThunk<MeterReading, RecordReadingPayload>(
    'meterReadings/record',
    async (payload, { rejectWithValue }) => {
        try {
            const { roomId, electricImage, waterImage, ...data } = payload;
            const formData = new FormData();
            formData.append('data', new Blob([JSON.stringify(data)], { type: 'application/json' }));

            if (electricImage) {
                formData.append('electricImage', electricImage);
            }
            if (waterImage) {
                formData.append('waterImage', waterImage);
            }

            const response = await api.post<ApiResponse<MeterReading>>(`/rooms/${roomId}/meter-readings`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            return response.data.data;
        } catch (err) {
            const error = err as AxiosError<{ message: string }>;
            return rejectWithValue(error.response?.data?.message || 'Failed to record meter reading');
        }
    }
);