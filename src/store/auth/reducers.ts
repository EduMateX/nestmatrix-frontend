// src/store/auth/reducers.ts
import { createSlice } from '@reduxjs/toolkit';
import { AuthState } from './types';
import { loginAction, logoutAction, fetchUserProfile } from './actions';

const initialState: AuthState = {
    isAuthenticated: false,
    user: null,
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        // Action đồng bộ có thể thêm ở đây, ví dụ clearError
        clearAuthError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Xử lý login
            .addCase(loginAction.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(loginAction.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.isAuthenticated = true;
                state.user = action.payload;
            })
            .addCase(loginAction.rejected, (state, action) => {
                state.status = 'failed';
                state.isAuthenticated = false;
                state.user = null;
                state.error = action.payload ?? 'An unknown login error occurred';
            })
            // Xử lý fetch user profile (hữu ích khi refresh trang)
            .addCase(fetchUserProfile.fulfilled, (state, action) => {
                state.isAuthenticated = true;
                state.user = action.payload;
                state.status = 'succeeded';
            })
            .addCase(fetchUserProfile.rejected, (state) => {
                state.isAuthenticated = false;
                state.user = null;
                state.status = 'failed';
            })
            // Xử lý logout
            .addCase(logoutAction.fulfilled, (state) => {
                state.isAuthenticated = false;
                state.user = null;
                state.status = 'idle';
            });
    },
});

export const { clearAuthError } = authSlice.actions;
export default authSlice.reducer;