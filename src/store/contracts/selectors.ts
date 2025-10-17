// src/store/contracts/selectors.ts
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

export const selectContractsPagination = (state: RootState) => ({
    currentPage: state.contracts.currentPage,
    totalPages: state.contracts.totalPages,
    totalElements: state.contracts.totalElements,
});