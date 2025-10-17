import { createSlice } from '@reduxjs/toolkit';
import { RoomsState } from './types';
import { fetchRooms, createRoom, updateRoom, deleteRoom, fetchRoomById } from './actions';

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
            state.currentPage = 0;
            state.totalPages = 0;
            state.totalElements = 0;
            state.status = 'idle';
        },
        resetStatus: (state) => {
            state.status = 'idle';
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
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
            .addCase(deleteRoom.fulfilled, (state, action) => {
                state.items = state.items.filter((item) => item.id !== action.payload);
                state.totalElements -= 1;
                state.status = 'succeeded';
            })
            .addCase(createRoom.fulfilled, (state, action) => {
                state.items.push(action.payload);
                state.totalElements += 1;
                state.status = 'succeeded';
            })
            .addCase(updateRoom.fulfilled, (state, action) => {
                const index = state.items.findIndex((item) => item.id === action.payload.id);
                if (index !== -1) {
                    state.items[index] = action.payload;
                }
                state.status = 'succeeded';
            })
            .addCase(fetchRoomById.fulfilled, (state, action) => {
                const index = state.items.findIndex(item => item.id === action.payload.id);
                if (index !== -1) {
                    state.items[index] = action.payload;
                } else {
                    state.items.push(action.payload);
                }
            });
    },
});

export const { clearRooms, resetStatus } = roomsSlice.actions;
export default roomsSlice.reducer;