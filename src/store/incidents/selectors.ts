import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '@/store';

// Lấy toàn bộ danh sách sự cố đang được lưu trong state
export const selectAllIncidents = (state: RootState) => state.incidents.items;

// Lấy trạng thái loading/succeeded/failed của module
export const selectIncidentsStatus = (state: RootState) => state.incidents.status;

// Lấy thông tin lỗi (nếu có)
export const selectIncidentsError = (state: RootState) => state.incidents.error;

// Lấy một sự cố cụ thể bằng ID (hữu ích nếu có trang chi tiết sau này)
export const selectIncidentById = (id: number) => (state: RootState) =>
    state.incidents.items.find((incident) => incident.id === id);

// Input selectors
const selectIncidentsCurrentPage = (state: RootState) => state.incidents.currentPage;
const selectIncidentsTotalPages = (state: RootState) => state.incidents.totalPages;
const selectIncidentsTotalElements = (state: RootState) => state.incidents.totalElements;

// Memoized selector
export const selectIncidentsPagination = createSelector(
    [selectIncidentsCurrentPage, selectIncidentsTotalPages, selectIncidentsTotalElements],
    (currentPage, totalPages, totalElements) => ({
        currentPage,
        totalPages,
        totalElements,
    })
);