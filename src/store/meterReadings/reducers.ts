import { createSlice } from '@reduxjs/toolkit';
import { MeterReadingsState } from './types';
import { fetchMeterReadingsByRoom, recordMeterReading } from './actions';

const initialState: MeterReadingsState = {
    items: [],
    status: 'idle',
    error: null,
};

const meterReadingsSlice = createSlice({
    name: 'meterReadings',
    initialState,
    reducers: {
        // Action để dọn dẹp state khi người dùng rời khỏi trang lịch sử
        clearReadings: (state) => {
            state.items = [];
            state.status = 'idle';
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Xử lý fetch lịch sử
            .addCase(fetchMeterReadingsByRoom.pending, (state) => {
                state.status = 'loading';
                state.items = []; // Xóa dữ liệu cũ
            })
            .addCase(fetchMeterReadingsByRoom.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload; // Ghi đè state với dữ liệu mới của phòng đang xem
            })
            .addCase(fetchMeterReadingsByRoom.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            })

            // Xử lý khi ghi một chỉ số mới thành công
            .addCase(recordMeterReading.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(recordMeterReading.fulfilled, (state, action) => {
                state.status = 'succeeded';
                // Thêm bản ghi mới vào đầu danh sách nếu đang ở trang lịch sử của phòng đó
                if (state.items.length === 0 || state.items[0].roomId === action.payload.roomId) {
                    state.items.unshift(action.payload);
                }
            })
            .addCase(recordMeterReading.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            });
    },
});

export const { clearReadings } = meterReadingsSlice.actions;
export default meterReadingsSlice.reducer;