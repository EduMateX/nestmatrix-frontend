import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '@/store';

// Lấy toàn bộ danh sách hợp đồng trong state hiện tại
export const selectAllContracts = (state: RootState) => state.contracts.items;

// Lấy trạng thái loading/succeeded/failed của module
export const selectContractsStatus = (state: RootState) => state.contracts.status;

// Lấy thông tin lỗi (nếu có)
export const selectContractsError = (state: RootState) => state.contracts.error;

// Lấy một hợp đồng cụ thể bằng ID
export const selectContractById = (id: number) => (state: RootState) =>
    state.contracts.items.find((contract) => contract.id === id);

// Selector đã được memoize để lấy thông tin phân trang
export const selectContractsPagination = createSelector(
    (state: RootState) => state.contracts.currentPage,
    (state: RootState) => state.contracts.totalPages,
    (state: RootState) => state.contracts.totalElements,
    (currentPage, totalPages, totalElements) => ({
        currentPage,
        totalPages,
        totalElements,
    })
);