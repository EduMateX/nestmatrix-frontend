import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { authReducer } from './auth';
import { buildingsReducer } from './buildings';
import { roomsReducer } from './rooms';
import { tenantsReducer } from './tenants';
import { contractsReducer } from './contracts';
import { meterReadingsReducer } from './meterReadings';
import { incidentsReducer } from './incidents';
import { dashboardReducer } from './dashboard';
import { invoicesReducer } from './invoices';
import { settingsReducer } from './settings';
import { notificationsReducer } from './notifications';
import { userRequestsReducer } from '@/store/userRequests';

// Kết hợp tất cả reducer từ các module
const rootReducer = combineReducers({
  auth: authReducer,
  buildings: buildingsReducer,
  rooms: roomsReducer,
  tenants: tenantsReducer,
  contracts: contractsReducer,
  meterReadings: meterReadingsReducer,
  incidents: incidentsReducer,
  dashboard: dashboardReducer,
  invoices: invoicesReducer,
  settings: settingsReducer,
  notifications: notificationsReducer,
  userRequests: userRequestsReducer,
});

// Cấu hình store
export const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production',

});

// Export các kiểu dữ liệu để sử dụng trong toàn bộ ứng dụng
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;