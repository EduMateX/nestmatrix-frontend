import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/api/axiosClient';
import { ApiResponse, Page } from '@/types/api';
import { CreateRoomPayload, FetchRoomsPayload, Room, UpdateRoomPayload } from './types';
import { AxiosError } from 'axios';

// export const fetchRoomsByBuilding = createAsyncThunk<Room[], number>(
//     'rooms/fetchByBuilding',
//     async (buildingId, { rejectWithValue }) => {
//         try {
//             const response = await api.get<ApiResponse<Room[]>>(`/buildings/${buildingId}/rooms`);
//             return response.data.data;
//         } catch (err) {
//             const error = err as AxiosError<{ message: string }>;
//             return rejectWithValue(error.response?.data?.message || 'Failed to fetch rooms');
//         }
//     }
// );

export const fetchRooms = createAsyncThunk<Page<Room>, FetchRoomsPayload>(
    'rooms/fetchRooms',
    async ({ page, size, buildingId, status, keyword }, { rejectWithValue }) => {
        try {
            const params = new URLSearchParams({
                page: String(page),
                size: String(size),
            });
            if (buildingId) params.append('buildingId', String(buildingId));
            if (status) params.append('status', status);
            if (keyword) params.append('keyword', keyword);

            const response = await api.get<ApiResponse<Page<Room>>>(`/rooms?${params.toString()}`);
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

// Get a single room by ID
export const fetchRoomById = createAsyncThunk<Room, number>(
    'rooms/fetchRoomById',
    async (id, { rejectWithValue }) => {
        try {
            const response = await api.get<ApiResponse<Room>>(`/rooms/${id}`);
            return response.data.data;
        } catch (err) {
            const error = err as AxiosError<{ message: string }>;
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch room details');
        }
    }
);

// Create a new room
export const createRoom = createAsyncThunk<Room, CreateRoomPayload>(
    'rooms/createRoom',
    async (roomData, { rejectWithValue }) => {
        try {
            // API của backend cần buildingId trong URL
            const { buildingId, ...roomDetails } = roomData;

            const formData = new FormData();
            const roomJson = JSON.stringify({
                roomNumber: roomDetails.roomNumber,
                price: roomDetails.price,
                area: roomDetails.area
            });
            formData.append('data', new Blob([roomJson], { type: 'application/json' }));

            if (roomData.image) {
                formData.append('image', roomData.image);
            }

            const response = await api.post<ApiResponse<Room>>(`/buildings/${buildingId}/rooms`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            return response.data.data;
        } catch (err) {
            const error = err as AxiosError<{ message: string }>;
            return rejectWithValue(error.response?.data?.message || 'Failed to create room');
        }
    }
);

// Update an existing room (Giả sử có API PUT /rooms/:id)
export const updateRoom = createAsyncThunk<Room, UpdateRoomPayload>(
    'rooms/updateRoom',
    async (roomData, { rejectWithValue }) => {
        try {
            // API cập nhật thông tin text (không bao gồm buildingId vì thường không cho đổi tòa nhà)
            const { id, image, ...roomDetails } = roomData;
            const response = await api.put<ApiResponse<Room>>(`/rooms/${id}`, roomDetails);

            // Nếu có ảnh mới, gọi API upload ảnh riêng (nếu backend có)
            if (image) {
                const formData = new FormData();
                formData.append('image', image);
                // Giả sử có API: POST /rooms/:id/image
                const imageResponse = await api.post<ApiResponse<Room>>(`/rooms/${id}/image`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
                return imageResponse.data.data;
            }

            return response.data.data;
        } catch (err) {
            const error = err as AxiosError<{ message: string }>;
            return rejectWithValue(error.response?.data?.message || 'Failed to update room');
        }
    }
);