import { RootState } from '@/store';
import { createSelector } from '@reduxjs/toolkit';

export const selectAllRooms = (state: RootState) => state.rooms.items;
export const selectRoomsStatus = (state: RootState) => state.rooms.status;
export const selectRoomById = (id: number) => (state: RootState) => state.rooms.items.find((room) => room.id === id);

const selectRoomsCurrentPage = (state: RootState) => state.rooms.currentPage;
const selectRoomsTotalPages = (state: RootState) => state.rooms.totalPages;
const selectRoomsTotalElements = (state: RootState) => state.rooms.totalElements;

export const selectRoomsPagination = createSelector(
    [selectRoomsCurrentPage, selectRoomsTotalPages, selectRoomsTotalElements],
    (currentPage, totalPages, totalElements) => ({
        currentPage,
        totalPages,
        totalElements,
    })
);