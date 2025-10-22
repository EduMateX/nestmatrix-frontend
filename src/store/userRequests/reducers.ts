import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserRequestsState } from './types';
import { fetchPendingRequests, approveRequest, rejectRequest } from './actions';
import { logoutAction } from '../auth';

const initialState: UserRequestsState = {
    items: [],
    status: 'idle',
    error: null,
};

const userRequestsSlice = createSlice({
    name: 'userRequests',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch Pending Requests
            .addCase(fetchPendingRequests.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchPendingRequests.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload;
            })
            .addCase(fetchPendingRequests.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            })

            // Approve Request: Khi thành công, loại bỏ yêu cầu khỏi danh sách "pending"
            .addCase(approveRequest.pending, (state) => {
                state.status = 'loading'; // Có thể dùng status riêng cho update nếu muốn
            })
            .addCase(approveRequest.fulfilled, (state, action: PayloadAction<number>) => {
                state.status = 'succeeded';
                state.items = state.items.filter(item => item.id !== action.payload);
            })
            .addCase(approveRequest.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            })

            // Reject Request: Tương tự, loại bỏ yêu cầu khỏi danh sách "pending"
            .addCase(rejectRequest.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(rejectRequest.fulfilled, (state, action: PayloadAction<number>) => {
                state.status = 'succeeded';
                state.items = state.items.filter(item => item.id !== action.payload);
            })
            .addCase(rejectRequest.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            })

            // Reset state khi logout
            .addCase(logoutAction.fulfilled, () => initialState);
    },
});

export default userRequestsSlice.reducer;