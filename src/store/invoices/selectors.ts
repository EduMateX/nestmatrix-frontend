import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '@/store';

// Lấy toàn bộ danh sách hóa đơn trong state hiện tại
export const selectAllInvoices = (state: RootState) => state.invoices.items;

// Lấy trạng thái loading/succeeded/failed của module
export const selectInvoicesStatus = (state: RootState) => state.invoices.status;

// Lấy thông tin lỗi (nếu có)
export const selectInvoicesError = (state: RootState) => state.invoices.error;

// Lấy một hóa đơn cụ thể bằng ID
export const selectInvoiceById = (id: number) => (state: RootState) =>
    state.invoices.items.find((invoice) => invoice.id === id);

// Selector đã được memoize để lấy thông tin phân trang
export const selectInvoicesPagination = createSelector(
    (state: RootState) => state.invoices.currentPage,
    (state: RootState) => state.invoices.totalPages,
    (state: RootState) => state.invoices.totalElements,
    (currentPage, totalPages, totalElements) => ({
        currentPage,
        totalPages,
        totalElements,
    })
);