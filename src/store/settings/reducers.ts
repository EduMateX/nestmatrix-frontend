import { createSlice } from '@reduxjs/toolkit';
import { SettingsState } from './types';
import { fetchSettings, updateSettings } from './actions';

const initialState: SettingsState = {
    items: [],
    status: 'idle',
    error: null,
};

const settingsSlice = createSlice({
    name: 'settings',
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder
            // Xử lý fetch tất cả settings
            .addCase(fetchSettings.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchSettings.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload;
            })
            .addCase(fetchSettings.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            })

            // Xử lý update settings
            .addCase(updateSettings.pending, (state) => {
                state.status = 'loading'; // Có thể dùng một state loading riêng nếu muốn (ví dụ: updateStatus)
            })
            .addCase(updateSettings.fulfilled, (state) => {
                state.status = 'succeeded'; // Cập nhật thành công
                // Không cần cập nhật `state.items` ở đây vì `fetchSettings` sẽ được gọi lại để lấy dữ liệu mới nhất.
            })
            .addCase(updateSettings.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            });
    },
});

export default settingsSlice.reducer;