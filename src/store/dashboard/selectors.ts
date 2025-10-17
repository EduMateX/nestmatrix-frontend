// src/store/dashboard/selectors.ts
import { RootState } from '@/store';

export const selectDashboardData = (state: RootState) => state.dashboard.data;
export const selectDashboardStatus = (state: RootState) => state.dashboard.status;
export const selectDashboardError = (state: RootState) => state.dashboard.error;

// Các selector tiện ích
export const selectDashboardStats = (state: RootState) => state.dashboard.data?.stats;
export const selectRevenueData = (state: RootState) => state.dashboard.data?.revenueByMonth;
export const selectExpiringContracts = (state: RootState) => state.dashboard.data?.expiringContracts;
export const selectPendingIncidents = (state: RootState) => state.dashboard.data?.pendingIncidents;