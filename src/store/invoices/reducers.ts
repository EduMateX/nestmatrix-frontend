import { createSlice } from '@reduxjs/toolkit';
import { InvoicesState } from './types';
import {
    fetchInvoices,
    fetchInvoiceById,
    confirmInvoicePayment
} from './actions';

const initialState: InvoicesState = {
    items: [],
    currentPage: 0,
    totalPages: 0,
    totalElements: 0,
    status: 'idle',
    error: null,
};

const invoicesSlice = createSlice({
    name: 'invoices',
    initialState,
    reducers: {
        resetStatus: (state) => {
            state.status = 'idle';
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch Invoices (danh sách)
            .addCase(fetchInvoices.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchInvoices.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload.content;
                state.currentPage = action.payload.number;
                state.totalPages = action.payload.totalPages;
                state.totalElements = action.payload.totalElements;
            })
            .addCase(fetchInvoices.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            })

            // Fetch Invoice By ID (chi tiết) và Confirm Payment
            // Cả hai action này đều trả về một đối tượng Invoice đã được cập nhật
            // nên chúng ta có thể dùng chung logic để cập nhật state.
            .addCase(fetchInvoiceById.fulfilled, (state, action) => {
                state.status = 'succeeded';
                const index = state.items.findIndex(item => item.id === action.payload.id);
                if (index !== -1) {
                    state.items[index] = action.payload;
                } else {
                    // Nếu item chưa có trong list, thêm nó vào.
                    // Hữu ích khi truy cập trực tiếp trang chi tiết.
                    state.items.push(action.payload);
                }
            })
            .addCase(confirmInvoicePayment.fulfilled, (state, action) => {
                state.status = 'succeeded';
                const index = state.items.findIndex(item => item.id === action.payload.id);
                if (index !== -1) {
                    state.items[index] = action.payload;
                }
            })
            .addCase(confirmInvoicePayment.pending, (state) => {
                // Có thể set status loading riêng cho hành động này nếu muốn
                // Ví dụ: state.confirmStatus = 'loading';
            })
            .addCase(confirmInvoicePayment.rejected, (state, action) => {
                state.error = action.payload as string;
            });
    },
});

export const { resetStatus } = invoicesSlice.actions;
export default invoicesSlice.reducer;