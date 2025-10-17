import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/api/axiosClient';
import { ApiResponse, Page } from '@/types/api';
import { Contract, ContractFormData, FetchContractsPayload } from './types';
import { AxiosError } from 'axios';

// Get all contracts
export const fetchContracts = createAsyncThunk<Page<Contract>, FetchContractsPayload>(
    'contracts/fetchContracts',
    async ({ page, size, status }, { rejectWithValue }) => {
        try {
            const params = new URLSearchParams({ page: String(page), size: String(size) });
            if (status) params.append('status', status);

            const response = await api.get<ApiResponse<Page<Contract>>>(`/contracts?${params.toString()}`);
            return response.data.data;
        } catch (err) {
            const error = err as AxiosError<{ message: string }>;
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch contracts');
        }
    }
);

// Create a new contract
export const createContract = createAsyncThunk<Contract, ContractFormData>('contracts/createContract', async (formData, { rejectWithValue }) => {
    try {
        const response = await api.post<ApiResponse<Contract>>('/contracts', formData);
        return response.data.data;
    } catch (err) {
        const error = err as AxiosError<{ message: string }>;
        return rejectWithValue(error.response?.data.message || 'Failed to create contract');
    }

});

// Terminate a contract
export const terminateContract = createAsyncThunk<Contract, number>('contracts/terminateContract', async (id, { rejectWithValue }) => {
    try {
        const response = await api.put<ApiResponse<Contract>>(`/contracts/${id}/terminate`);
        return response.data.data;
    } catch (err) {
        const error = err as AxiosError<{ message: string }>;
        return rejectWithValue(error.response?.data.message || 'Failed to terminate contract');
    }

});

// Get a single contract by ID
export const fetchContractById = createAsyncThunk<Contract, number>(
    'contracts/fetchContractById',
    async (id, { rejectWithValue }) => {
        try {
            const response = await api.get<ApiResponse<Contract>>(`/contracts/${id}`);
            return response.data.data;
        } catch (err) {
            const error = err as AxiosError<{ message: string }>;
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch contract details');
        }
    }
);

// action để upload file PDF
export const uploadContractFile = createAsyncThunk<Contract, { id: number; file: File }>(
    'contracts/uploadContractFile',
    async ({ id, file }, { rejectWithValue }) => {
        try {
            const formData = new FormData();
            formData.append('file', file);
            const response = await api.post<ApiResponse<Contract>>(`/contracts/${id}/upload-file`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            return response.data.data;
        } catch (err) {
            const error = err as AxiosError<{ message: string }>;
            return rejectWithValue(error.response?.data?.message || 'Failed to upload contract file');
        }
    }
);