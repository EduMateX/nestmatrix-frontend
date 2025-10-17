// src/store/tenants/actions.ts
import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/api/axiosClient';
import { ApiResponse, Page } from '@/types/api';
import { Tenant, CreateTenantPayload, UpdateTenantPayload, FetchTenantsPayload } from './types';
import { AxiosError } from 'axios';

// Get all tenants with pagination and search
export const fetchTenants = createAsyncThunk<Page<Tenant>, FetchTenantsPayload>(
    'tenants/fetchTenants',
    async ({ page, size, keyword }, { rejectWithValue }) => {
        try {
            const params = new URLSearchParams({
                page: String(page),
                size: String(size),
                sort: 'fullName,asc',
            });
            if (keyword) {
                params.append('keyword', keyword);
            }
            const response = await api.get<ApiResponse<Page<Tenant>>>(`/tenants?${params.toString()}`);
            return response.data.data;
        } catch (err) {
            const error = err as AxiosError<{ message: string }>;
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch tenants');
        }
    }
);

// Get a single tenant by ID
export const fetchTenantById = createAsyncThunk<Tenant, number>('tenants/fetchTenantById', async (id, { rejectWithValue }) => {
    try {
        const response = await api.get<ApiResponse<Tenant>>(`/tenants/${id}`);
        return response.data.data;
    } catch (err) {
        const error = err as AxiosError<{ message: string }>;
        return rejectWithValue(error.response?.data?.message || 'Failed to fetch tenant details');
    }
});

// Create a new tenant
export const createTenant = createAsyncThunk<Tenant, CreateTenantPayload>('tenants/createTenant', async (tenantData, { rejectWithValue }) => {
    try {
        const { image, ...details } = tenantData;
        const formData = new FormData();
        formData.append('data', new Blob([JSON.stringify(details)], { type: 'application/json' }));
        if (image) {
            formData.append('image', image);
        }
        const response = await api.post<ApiResponse<Tenant>>('/tenants', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
        return response.data.data;
    } catch (err) {
        const error = err as AxiosError<{ message: string }>;
        return rejectWithValue(error.response?.data?.message || 'Failed to create tenant');
    }
});

// Update an existing tenant
export const updateTenant = createAsyncThunk<Tenant, UpdateTenantPayload>('tenants/updateTenant', async (tenantData, { rejectWithValue }) => {
    try {
        const { id, image, ...details } = tenantData;
        // API cập nhật thông tin text
        const response = await api.put<ApiResponse<Tenant>>(`/tenants/${id}`, details);

        // Nếu có ảnh mới, gọi API upload ảnh
        if (image) {
            const formData = new FormData();
            formData.append('image', image);
            return (await api.post<ApiResponse<Tenant>>(`/tenants/${id}/citizen-id-image`, formData, { headers: { 'Content-Type': 'multipart/form-data' } })).data.data;
        }
        return response.data.data;
    } catch (err) {
        const error = err as AxiosError<{ message: string }>;
        return rejectWithValue(error.response?.data?.message || 'Failed to update tenant');
    }
});

// Delete a tenant
export const deleteTenant = createAsyncThunk<number, number>('tenants/deleteTenant', async (id, { rejectWithValue }) => {
    try {
        await api.delete(`/tenants/${id}`);
        return id;
    } catch (err) {
        const error = err as AxiosError<{ message: string }>;
        return rejectWithValue(error.response?.data?.message || 'Failed to delete tenant');
    }
});