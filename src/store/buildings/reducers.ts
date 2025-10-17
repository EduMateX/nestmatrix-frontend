import { createSlice } from '@reduxjs/toolkit';
import { BuildingsState } from './types';
import { fetchBuildings, createBuilding, updateBuilding, deleteBuilding, fetchBuildingById } from './actions';

const initialState: BuildingsState = {
    items: [],
    currentPage: 0,
    totalPages: 0,
    totalElements: 0,
    status: 'idle',
    error: null,
};

const buildingsSlice = createSlice({
    name: 'buildings',
    initialState,
    reducers: {
        resetStatus: (state) => {
            state.status = 'idle';
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch
            .addCase(fetchBuildings.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchBuildings.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload.content;
                state.currentPage = action.payload.number;
                state.totalPages = action.payload.totalPages;
                state.totalElements = action.payload.totalElements;
            })
            .addCase(fetchBuildings.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            })
            // Create: Thêm vào cuối danh sách
            .addCase(createBuilding.fulfilled, (state, action) => {
                state.items.push(action.payload);
                state.totalElements += 1; // Tăng tổng số
                state.status = 'succeeded';
            })
            // Update: Cập nhật item trong danh sách
            .addCase(updateBuilding.fulfilled, (state, action) => {
                const index = state.items.findIndex((item) => item.id === action.payload.id);
                if (index !== -1) {
                    state.items[index] = action.payload;
                }
                state.status = 'succeeded';
            })
            // Delete: Xóa item khỏi danh sách
            .addCase(deleteBuilding.fulfilled, (state, action) => {
                state.items = state.items.filter((item) => item.id !== action.payload);
                state.totalElements -= 1; // Giảm tổng số
                state.status = 'succeeded';
            })
            // Fetch By ID: Cập nhật hoặc thêm item
            .addCase(fetchBuildingById.fulfilled, (state, action) => {
                const index = state.items.findIndex(item => item.id === action.payload.id);
                if (index !== -1) {
                    state.items[index] = action.payload;
                } else {
                    // Thêm vào nếu chưa có, phòng trường hợp truy cập trực tiếp trang edit
                    state.items.push(action.payload);
                }
            });
    },
});

export const { resetStatus } = buildingsSlice.actions;
export default buildingsSlice.reducer;