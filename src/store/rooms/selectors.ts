import { RootState } from '@/store';

export const selectAllRooms = (state: RootState) => state.rooms.items;
export const selectRoomsStatus = (state: RootState) => state.rooms.status;
export const selectRoomById = (id: number) => (state: RootState) => state.rooms.items.find((room) => room.id === id);

export const selectRoomsPagination = (state: RootState) => ({
    currentPage: state.rooms.currentPage,
    totalPages: state.rooms.totalPages,
    totalElements: state.rooms.totalElements,
});