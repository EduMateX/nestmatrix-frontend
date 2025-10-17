// src/store/contracts/reducers.ts
import { createSlice } from '@reduxjs/toolkit';
import { ContractsState } from './types';
import {
    fetchContracts,
    createContract,
    terminateContract,
    fetchContractById,
    uploadContractFile
} from './actions';

const initialState: ContractsState = {
    items: [],
    currentPage: 0,
    totalPages: 0,
    totalElements: 0,
    status: 'idle',
    error: null,
};

const contractsSlice = createSlice({
    name: 'contracts',
    initialState,
    reducers: {
        // Action để reset status, có thể dùng khi rời khỏi trang
        resetStatus: (state) => {
            state.status = 'idle';
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch All Contracts
            .addCase(fetchContracts.pending, (state) => { state.status = 'loading'; })
            .addCase(fetchContracts.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload.content;
                state.currentPage = action.payload.number;
                state.totalPages = action.payload.totalPages;
                state.totalElements = action.payload.totalElements;
            })
            .addCase(fetchContracts.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            })

            // Create Contract
            .addCase(createContract.pending, (state) => { state.status = 'loading'; })
            .addCase(createContract.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items.push(action.payload);
            })
            .addCase(createContract.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            })

            .addCase(terminateContract.fulfilled, (state) => {
                state.status = 'idle'; // Trigger refetch
            })
            .addCase(fetchContractById.pending, (state) => { state.status = 'loading'; })
            .addCase(fetchContractById.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            })
            .addCase(fetchContractById.fulfilled, (state, action) => {
                state.status = 'succeeded';
                // Cập nhật hoặc thêm hợp đồng vào danh sách
                const index = state.items.findIndex(item => item.id === action.payload.id);
                if (index !== -1) {
                    state.items[index] = action.payload;
                } else {
                    state.items.push(action.payload);
                }
            })
            .addCase(uploadContractFile.fulfilled, (state, action) => {
                // Tương tự, cập nhật lại hợp đồng trong danh sách
                const index = state.items.findIndex(item => item.id === action.payload.id);
                if (index !== -1) {
                    state.items[index] = action.payload;
                }
            });
    },
});

export const { resetStatus } = contractsSlice.actions;
export default contractsSlice.reducer;