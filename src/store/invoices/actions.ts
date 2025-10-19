import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/api/axiosClient';
import { ApiResponse, Page } from '@/types/api';
import { Invoice, FetchInvoicesPayload, GenerateInvoicePayload } from './types';
import { AxiosError } from 'axios';

// Fetch invoices with filters and pagination
export const fetchInvoices = createAsyncThunk<Page<Invoice>, FetchInvoicesPayload>(
    'invoices/fetchInvoices',
    async (filters, { rejectWithValue }) => {
        try {
            const params = new URLSearchParams();
            params.append('page', String(filters.page));
            params.append('size', String(filters.size));
            if (filters.buildingId) params.append('buildingId', String(filters.buildingId));
            if (filters.roomId) params.append('roomId', String(filters.roomId));
            if (filters.status) params.append('status', filters.status);

            const response = await api.get<ApiResponse<Page<Invoice>>>(`/invoices?${params.toString()}`);
            return response.data.data;
        } catch (err) {
            const error = err as AxiosError<{ message: string }>;
            return rejectWithValue(error.response?.data.message || 'Failed to fetch invoices');

        }
    }
);

// Fetch a single invoice
export const fetchInvoiceById = createAsyncThunk<Invoice, number>(
    'invoices/fetchInvoiceById',
    async (invoiceId, { rejectWithValue }) => {
        try {
            const response = await api.get<ApiResponse<Invoice>>(`/invoices/${invoiceId}`);
            return response.data.data;
        } catch (err) {
            const error = err as AxiosError<{ message: string }>;
            return rejectWithValue(error.response?.data.message || 'Failed to fetch invoice');
        }
    }
);

// Confirm payment for an invoice
export const confirmInvoicePayment = createAsyncThunk<Invoice, number>(
    'invoices/confirmPayment',
    async (invoiceId, { rejectWithValue }) => {
        try {
            const response = await api.put<ApiResponse<Invoice>>(`/invoices/${invoiceId}/confirm-payment`);
            return response.data.data;
        } catch (err) {
            const error = err as AxiosError<{ message: string }>;
            return rejectWithValue(error.response?.data.message || 'Failed to confirm invoice payment');
        }
    }
);

export const generateInvoice = createAsyncThunk<Invoice, GenerateInvoicePayload>(
    'invoices/generate',
    async (payload, { rejectWithValue }) => {
        try {
            const response = await api.post<ApiResponse<Invoice>>('/invoices/generate', payload);
            return response.data.data;
        } catch (err) {
            const error = err as AxiosError<{ message: string }>;
            return rejectWithValue(error.response?.data?.message || 'Tạo hóa đơn thất bại.');
        }
    }
);