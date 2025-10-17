import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { authReducer } from './auth';
import { buildingsReducer } from './buildings';
import { roomsReducer } from './rooms';

// Kết hợp tất cả reducer từ các module
const rootReducer = combineReducers({
  auth: authReducer,
  buildings: buildingsReducer,
  rooms: roomsReducer,
});

// Cấu hình store
export const store = configureStore({
  reducer: rootReducer,
});

// Export các kiểu dữ liệu để sử dụng trong toàn bộ ứng dụng
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;