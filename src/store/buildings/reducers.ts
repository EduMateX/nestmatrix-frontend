import { createSlice } from '@reduxjs/toolkit';
import { BuildingsState } from './types';
import { fetchBuildings, deleteBuilding, createBuilding, fetchBuildingById, updateBuilding } from './actions';

const initialState: BuildingsState = {
    items: [],
    status: 'idle',
    error: null,
};

const buildingsSlice = createSlice({
    name: 'buildings',
    initialState,
    reducers: {
        // Action để reset status, hữu ích khi rời khỏi trang form
        resetStatus: (state) => {
            state.status = 'idle';
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchBuildings.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchBuildings.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload;
            })
            .addCase(fetchBuildings.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            })
            .addCase(deleteBuilding.fulfilled, (state, action) => {
                state.items = state.items.filter((item) => item.id !== action.payload);
            })
            // Create Building
            .addCase(createBuilding.pending, (state) => { state.status = 'loading'; })
            .addCase(createBuilding.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items.push(action.payload);
            })
            .addCase(createBuilding.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            })
            // Update Building
            .addCase(updateBuilding.pending, (state) => { state.status = 'loading'; })
            .addCase(updateBuilding.fulfilled, (state, action) => {
                state.status = 'succeeded';
                const index = state.items.findIndex(item => item.id === action.payload.id);
                if (index !== -1) {
                    state.items[index] = action.payload;
                }
            })
            .addCase(updateBuilding.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            })
            // Fetch Building By ID (không cần cập nhật list, chỉ set status)
            .addCase(fetchBuildingById.pending, (state) => { state.status = 'loading'; })
            .addCase(fetchBuildingById.fulfilled, (state) => { state.status = 'succeeded'; })
            .addCase(fetchBuildingById.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            });
    },
});

export const { resetStatus } = buildingsSlice.actions;
export default buildingsSlice.reducer;