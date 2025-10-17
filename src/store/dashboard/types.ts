export interface DashboardStats {
    totalBuildings: number;
    totalRooms: number;
    rentedRooms: number;
    availableRooms: number;
    totalTenants: number;
    expiringContracts: number;
}

export interface RevenueByMonth {
    month: string; // "YYYY-MM"
    totalRevenue: number;
}

export interface QuickListItem {
    id: number;
    title: string;
    subtitle: string;
    date: string; // "YYYY-MM-DD"
}

export interface DashboardData {
    stats: DashboardStats;
    revenueByMonth: RevenueByMonth[];
    expiringContracts: QuickListItem[];
    pendingIncidents: QuickListItem[];
}

export interface DashboardState {
    data: DashboardData | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}