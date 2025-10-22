import { createSlice } from '@reduxjs/toolkit';
import { IncidentsState } from './types';
import {
    fetchIncidentsByBuilding,
    updateIncidentStatus,
    deleteIncident
} from './actions';

const initialState: IncidentsState = {
    items: [],
    status: 'idle',
    error: null,
};

const incidentsSlice = createSlice({
    name: 'incidents',
    initialState,
    reducers: {
        // Action để reset status khi cần
        resetStatus: (state) => {
            state.status = 'idle';
            state.error = null;
        },
        clearIncidents: (state) => {
            state.items = [];
            state.status = 'idle';
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch Incidents by Building
            .addCase(fetchIncidentsByBuilding.pending, (state) => {
                state.status = 'loading';
                state.items = []; // Xóa dữ liệu cũ khi bắt đầu fetch mới
            })
            .addCase(fetchIncidentsByBuilding.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload;
            })
            .addCase(fetchIncidentsByBuilding.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            })

            // Update Incident Status
            .addCase(updateIncidentStatus.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(updateIncidentStatus.fulfilled, (state, action) => {
                state.status = 'succeeded';
                const index = state.items.findIndex(item => item.id === action.payload.id);
                if (index !== -1) {
                    // Cập nhật lại sự cố trong danh sách với dữ liệu mới từ server
                    state.items[index] = action.payload;
                }
            })
            .addCase(updateIncidentStatus.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            })

            // Delete Incident
            .addCase(deleteIncident.fulfilled, (state, action) => {
                // Xóa sự cố khỏi danh sách
                state.items = state.items.filter((item) => item.id !== action.payload);
            });
    },
});

export const { resetStatus, clearIncidents } = incidentsSlice.actions;
export default incidentsSlice.reducer;