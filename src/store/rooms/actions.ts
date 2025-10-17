import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/api/axiosClient';
import { ApiResponse } from '@/types/api';
import { Room } from './types';
import { AxiosError } from 'axios';

// Get all rooms (có thể thêm filter theo buildingId sau)
export const fetchRooms = createAsyncThunk<Room[]>(
    'rooms/fetchRooms',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get<ApiResponse<Room[]>>('/rooms');
            return response.data.data;
        } catch (err) {
            const error = err as AxiosError<{ message: string }>;
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch rooms');
        }
    }
);

// Delete a room
export const deleteRoom = createAsyncThunk<number, number>(
    'rooms/deleteRoom',
    async (id, { rejectWithValue }) => {
        try {
            await api.delete(`/rooms/${id}`);
            return id;
        } catch (err) {
            const error = err as AxiosError<{ message: string }>;
            return rejectWithValue(error.response?.data?.message || 'Failed to delete room');
        }
    }
);