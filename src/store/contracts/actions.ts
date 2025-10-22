import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/api/axiosClient';
import { ApiResponse, Page } from '@/types/api';
import { Contract, ContractFormData, FetchContractsPayload, ParsedContractData, UploadContractFilePayload } from './types';
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
export const uploadContractFile = createAsyncThunk<Contract, UploadContractFilePayload>(
    'contracts/uploadFile',
    async ({ id, file, overwriteData }, { rejectWithValue }) => {
        try {
            const formData = new FormData();
            formData.append('file', file);

            // Thêm query param `overwriteData`
            const response = await api.post<ApiResponse<Contract>>(`/contracts/${id}/upload-file?overwriteData=${overwriteData}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            return response.data.data;
        } catch (err) {
            const error = err as AxiosError<{ message: string }>;
            return rejectWithValue(error.response?.data?.message || 'Tải file lên thất bại.');
        }
    }
);


/**
 * Action để gửi file hợp đồng lên backend và nhận về dữ liệu đã được phân tích.
 */
export const parseContractFile = createAsyncThunk<ParsedContractData, File>(
    'contracts/parseFile',
    async (file, { rejectWithValue }) => {
        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await api.post<ApiResponse<ParsedContractData>>('/contracts/parse-file', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            return response.data.data;
        } catch (err) {
            const error = err as AxiosError<{ message: string }>;
            return rejectWithValue(error.response?.data?.message || 'Không thể phân tích file.');
        }
    }
);

/**
 * [ADMIN] "Chốt" hợp đồng và gửi đi để ký (status -> WAITING_SIGNATURES).
 */
export const sendForSigning = createAsyncThunk<Contract, number>(
    'contracts/sendForSigning',
    async (contractId, { rejectWithValue }) => {
        try {
            const response = await api.post<ApiResponse<Contract>>(`/contracts/${contractId}/send-for-signing`);
            return response.data.data;
        } catch (err) {
            const error = err as AxiosError<{ message: string }>;
            return rejectWithValue(error.response?.data?.message || 'Gửi yêu cầu ký thất bại.');
        }
    }
);

/**
 * [ADMIN] Duyệt chữ ký số của khách và kích hoạt hợp đồng (status -> ACTIVE).
 */
export const approveSignature = createAsyncThunk<Contract, number>(
    'contracts/approveSignature',
    async (contractId, { rejectWithValue }) => {
        try {
            const response = await api.post<ApiResponse<Contract>>(`/contracts/${contractId}/approve-signature`);
            return response.data.data;
        } catch (err) {
            const error = err as AxiosError<{ message: string }>;
            return rejectWithValue(error.response?.data?.message || 'Duyệt chữ ký thất bại.');
        }
    }
);

/**
 * [ADMIN/USER] Gửi yêu cầu chấm dứt hợp đồng (status -> PENDING_TERMINATION).
 */
export const requestTermination = createAsyncThunk<Contract, number>(
    'contracts/requestTermination',
    async (contractId, { rejectWithValue }) => {
        try {
            // API này có thể được gọi bởi cả user và admin
            const response = await api.post<ApiResponse<Contract>>(`/contracts/${contractId}/request-termination`);
            return response.data.data;
        } catch (err) {
            const error = err as AxiosError<{ message: string }>;
            return rejectWithValue(error.response?.data?.message || 'Gửi yêu cầu chấm dứt thất bại.');
        }
    }
);

/**
 * [USER] Ký hợp đồng bằng kỹ thuật số (gửi ảnh chữ ký).
 */
export const signDigitally = createAsyncThunk<Contract, { contractId: number; signatureImage: string }>(
    'contracts/signDigitally',
    async ({ contractId, signatureImage }, { rejectWithValue }) => {
        try {
            const response = await api.post<ApiResponse<Contract>>(`/contracts/${contractId}/sign-digitally`, { signatureImage });
            return response.data.data;
        } catch (err) {
            const error = err as AxiosError<{ message: string }>;
            return rejectWithValue(error.response?.data?.message || 'Ký hợp đồng thất bại.');
        }
    }
);

/**
 * [ADMIN/USER] Xác nhận yêu cầu chấm dứt (status -> TERMINATED).
 */
export const confirmTermination = createAsyncThunk<Contract, number>(
    'contracts/confirmTermination',
    async (contractId, { rejectWithValue }) => {
        try {
            const response = await api.post<ApiResponse<Contract>>(`/contracts/${contractId}/confirm-termination`);
            return response.data.data;
        } catch (err) {
            const error = err as AxiosError<{ message: string }>;
            return rejectWithValue(error.response?.data?.message || 'Xác nhận chấm dứt thất bại.');
        }
    }
);