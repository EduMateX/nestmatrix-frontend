import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/api/axiosClient';
import { ApiResponse } from '@/types/api';
import { Incident, UpdateIncidentStatusPayload } from './types';
import { AxiosError } from 'axios';

// Get incidents by building ID
export const fetchIncidentsByBuilding = createAsyncThunk<Incident[], number>(
    'incidents/fetchByBuilding',
    async (buildingId, { rejectWithValue }) => {
        try {
            const response = await api.get<ApiResponse<Incident[]>>(`/incidents/building/${buildingId}`);
            return response.data.data;
        } catch (err) {
            const error = err as AxiosError<{ message: string }>;
            return rejectWithValue(error.response?.data.message || 'Failed to fetch incidents');
        }
    }
);

// Update an incident's status and/or priority
export const updateIncidentStatus = createAsyncThunk<Incident, UpdateIncidentStatusPayload>(
    'incidents/updateStatus',
    async (payload, { rejectWithValue }) => {
        try {
            const { id, ...data } = payload;
            const response = await api.put<ApiResponse<Incident>>(`/incidents/${id}/status`, data);
            return response.data.data;
        } catch (err) {
            const error = err as AxiosError<{ message: string }>;
            return rejectWithValue(error.response?.data.message || 'Failed to update incident status');
        }
    }
);

// Delete an incident
export const deleteIncident = createAsyncThunk<number, number>(
    'incidents/deleteIncident',
    async (id, { rejectWithValue }) => {
        try {
            await api.delete(`/incidents/${id}`);
            return id;
        } catch (err) {
            const error = err as AxiosError<{ message: string }>;
            return rejectWithValue(error.response?.data.message || 'Failed to delete incident');
        }
    }
);