import { createSlice } from '@reduxjs/toolkit';
import { RoomsState } from './types';
import { fetchRooms, deleteRoom, createRoom, updateRoom, fetchRoomById } from './actions';

const initialState: RoomsState = {
    items: [],
    currentPage: 0,
    totalPages: 0,
    totalElements: 0,
    status: 'idle',
    error: null,
};

const roomsSlice = createSlice({
    name: 'rooms',
    initialState,
    reducers: {
        clearRooms: (state) => {
            state.items = [];
            state.status = 'idle';
            state.totalPages = 0;
            state.totalElements = 0;
            state.currentPage = 0;
        },
        resetStatus: (state) => {
            state.status = 'idle';
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch Rooms (với phân trang và filter)
            .addCase(fetchRooms.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchRooms.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload.content;
                state.currentPage = action.payload.number;
                state.totalPages = action.payload.totalPages;
                state.totalElements = action.payload.totalElements;
            })
            .addCase(fetchRooms.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            })

            // Sau khi delete/create/update, set status về 'idle' để trigger fetch lại
            .addCase(deleteRoom.fulfilled, (state) => {
                state.status = 'idle';
            })
            .addCase(createRoom.fulfilled, (state) => {
                state.status = 'idle';
            })
            .addCase(updateRoom.fulfilled, (state) => {
                state.status = 'idle';
            })

            // Fetch Room By ID (để đảm bảo dữ liệu trong list luôn mới)
            .addCase(fetchRoomById.fulfilled, (state, action) => {
                const index = state.items.findIndex(item => item.id === action.payload.id);
                if (index !== -1) {
                    state.items[index] = action.payload;
                } else {
                    // Thêm vào nếu chưa có (trường hợp hiếm, nhưng đảm bảo an toàn)
                    state.items.push(action.payload);
                }
            });
    },
});

export const { clearRooms, resetStatus } = roomsSlice.actions;
export default roomsSlice.reducer;