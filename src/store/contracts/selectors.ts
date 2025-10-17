import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '@/store';

// Lấy toàn bộ danh sách hợp đồng
export const selectAllContracts = (state: RootState) => state.contracts.items;

// Lấy trạng thái loading/succeeded/failed của module
export const selectContractsStatus = (state: RootState) => state.contracts.status;

// Lấy thông tin lỗi (nếu có)
export const selectContractsError = (state: RootState) => state.contracts.error;

// Lấy một hợp đồng cụ thể bằng ID
export const selectContractById = (id: number) => (state: RootState) =>
    state.contracts.items.find((contract) => contract.id === id);

const selectContractsCurrentPage = (state: RootState) => state.contracts.currentPage;
const selectContractsTotalPages = (state: RootState) => state.contracts.totalPages;
const selectContractsTotalElements = (state: RootState) => state.contracts.totalElements;

// Memoized selector
export const selectContractsPagination = createSelector(
    [selectContractsCurrentPage, selectContractsTotalPages, selectContractsTotalElements],
    (currentPage, totalPages, totalElements) => ({
        currentPage,
        totalPages,
        totalElements,
    })
);