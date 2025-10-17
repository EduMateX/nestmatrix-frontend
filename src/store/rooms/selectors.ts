import { RootState } from '@/store';

export const selectAllRooms = (state: RootState) => state.rooms.items;
export const selectRoomsStatus = (state: RootState) => state.rooms.status;