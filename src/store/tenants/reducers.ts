import { createSlice } from '@reduxjs/toolkit';
import { TenantsState } from './types';
import { fetchTenants, createTenant, updateTenant, deleteTenant, fetchTenantById } from './actions';

const initialState: TenantsState = {
    items: [],
    currentPage: 0,
    totalPages: 0,
    totalElements: 0,
    status: 'idle',
    error: null,
};

const tenantsSlice = createSlice({
    name: 'tenants',
    initialState,
    reducers: {
        resetStatus: (state) => {
            state.status = 'idle';
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchTenants.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchTenants.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload.content;
                state.currentPage = action.payload.number;
                state.totalPages = action.payload.totalPages;
                state.totalElements = action.payload.totalElements;
            })
            .addCase(fetchTenants.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            })
            .addCase(deleteTenant.fulfilled, (state, action) => {
                state.items = state.items.filter((item) => item.id !== action.payload);
                state.totalElements -= 1;
                state.status = 'succeeded';
            })
            .addCase(createTenant.fulfilled, (state, action) => {
                // Không thêm trực tiếp vì có thể đang ở trang khác, fetch lại sẽ tốt hơn
                state.status = 'idle';
            })
            .addCase(updateTenant.fulfilled, (state, action) => {
                const index = state.items.findIndex((item) => item.id === action.payload.id);
                if (index !== -1) {
                    state.items[index] = action.payload;
                }
                state.status = 'succeeded';
            })
            .addCase(fetchTenantById.fulfilled, (state, action) => {
                const index = state.items.findIndex(item => item.id === action.payload.id);
                if (index !== -1) {
                    state.items[index] = action.payload;
                } else {
                    state.items.push(action.payload);
                }
            });
    },
});

export const { resetStatus } = tenantsSlice.actions;
export default tenantsSlice.reducer;