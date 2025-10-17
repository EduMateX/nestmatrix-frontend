import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/api/axiosClient';
import { ApiResponse, Page } from '@/types/api';
import { Building, CreateBuildingPayload, UpdateBuildingPayload } from './types';
import { AxiosError } from 'axios';

// Get all buildings
export const fetchBuildings = createAsyncThunk<Page<Building>, FetchBuildingsPayload>(
    'buildings/fetchBuildings',
    async ({ page, size, keyword }, { rejectWithValue }) => {
        try {
            const params = new URLSearchParams({
                page: String(page),
                size: String(size),
                sort: 'name,asc', // Mặc định sắp xếp theo tên
            });
            if (keyword) {
                params.append('keyword', keyword);
            }

            const response = await api.get<ApiResponse<Page<Building>>>(`/buildings?${params.toString()}`);
            return response.data.data;
        } catch (err) {
            const error = err as AxiosError<{ message: string }>;
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch buildings');
        }
    }
);

// Delete a building
export const deleteBuilding = createAsyncThunk<number, number>(
    'buildings/deleteBuilding',
    async (id, { rejectWithValue }) => {
        try {
            await api.delete(`/buildings/${id}`);
            return id;
        } catch (err) {
            const error = err as AxiosError<{ message: string }>;
            return rejectWithValue(error.response?.data?.message || 'Failed to delete building');
        }
    }
);

// Get a single building by ID
export const fetchBuildingById = createAsyncThunk<Building, number>(
    'buildings/fetchBuildingById',
    async (id, { rejectWithValue }) => {
        try {
            const response = await api.get<ApiResponse<Building>>(`/buildings/${id}`);
            return response.data.data;
        } catch (err) {
            const error = err as AxiosError<{ message: string }>;
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch building details');
        }
    }
);

// Create a new building
export const createBuilding = createAsyncThunk<Building, CreateBuildingPayload>(
    'buildings/createBuilding',
    async (buildingData, { rejectWithValue }) => {
        try {
            const formData = new FormData();
            const buildingJson = JSON.stringify({ name: buildingData.name, address: buildingData.address });
            formData.append('data', new Blob([buildingJson], { type: 'application/json' }));

            if (buildingData.image) {
                formData.append('image', buildingData.image);
            }

            const response = await api.post<ApiResponse<Building>>('/buildings', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            return response.data.data;
        } catch (err) {
            const error = err as AxiosError<{ message: string }>;
            return rejectWithValue(error.response?.data?.message || 'Failed to create building');
        }
    }
);

// Update an existing building
export const updateBuilding = createAsyncThunk<Building, UpdateBuildingPayload>(
    'buildings/updateBuilding',
    async (buildingData, { rejectWithValue }) => {
        try {
            // API cập nhật thông tin text
            const response = await api.put<ApiResponse<Building>>(`/buildings/${buildingData.id}`, {
                name: buildingData.name,
                address: buildingData.address
            });

            // Nếu có ảnh mới, gọi API upload ảnh riêng
            if (buildingData.image) {
                const formData = new FormData();
                formData.append('image', buildingData.image);
                const imageResponse = await api.post<ApiResponse<Building>>(`/buildings/${buildingData.id}/image`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
                return imageResponse.data.data;
            }

            return response.data.data;
        } catch (err) {
            const error = err as AxiosError<{ message: string }>;
            return rejectWithValue(error.response?.data?.message || 'Failed to update building');
        }
    }
);