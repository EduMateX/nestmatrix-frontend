// src/store/tenants/selectors.ts
import { RootState } from '@/store';
import { createSelector } from '@reduxjs/toolkit';

// Lấy toàn bộ danh sách khách thuê
export const selectAllTenants = (state: RootState) => state.tenants.items;

// Lấy trạng thái loading/succeeded/failed của module
export const selectTenantsStatus = (state: RootState) => state.tenants.status;

// Lấy thông tin lỗi (nếu có)
export const selectTenantsError = (state: RootState) => state.tenants.error;

// Lấy một khách thuê cụ thể bằng ID (dùng cho trang edit và breadcrumb)
export const selectTenantById = (id: number) => (state: RootState) => state.tenants.items.find((tenant) => tenant.id === id);

export const selectTenantsPagination = createSelector(
    (state: RootState) => state.tenants.currentPage,
    (state: RootState) => state.tenants.totalPages,
    (state: RootState) => state.tenants.totalElements,
    (currentPage, totalPages, totalElements) => ({
        currentPage,
        totalPages,
        totalElements,
    })
);