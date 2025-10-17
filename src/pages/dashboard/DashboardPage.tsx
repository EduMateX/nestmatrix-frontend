// src/pages/dashboard/DashboardPage.tsx
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
    fetchDashboardData,
    selectDashboardData,
    selectDashboardStatus
} from '@/store/dashboard';
import { Building, DoorOpen, Users, FileWarning, AlertTriangle } from 'lucide-react';
import { QuickList } from '@/components/dashboard/QuickList';
import { RevenueChart } from '@/components/dashboard/RevenueChart';
import { StatCard } from '@/components/dashboard/StatCard';

const DashboardPage = () => {
    const dispatch = useAppDispatch();
    const data = useAppSelector(selectDashboardData);
    const status = useAppSelector(selectDashboardStatus);
    const isLoading = status === 'loading' || status === 'idle';

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchDashboardData());
        }
    }, [status, dispatch]);

    const stats = data?.stats;
    const roomRatio = stats && stats.totalRooms > 0
        ? `${stats.rentedRooms} / ${stats.totalRooms}`
        : '0 / 0';

    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                <p className="text-muted-foreground">Tổng quan về tình hình kinh doanh của bạn.</p>
            </div>

            {/* Các thẻ chỉ số thống kê (không thay đổi) */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCard title="Tổng Tòa nhà" value={stats?.totalBuildings ?? 0} icon={Building} isLoading={isLoading} />
                <StatCard title="Phòng (Đã thuê / Tổng)" value={roomRatio} icon={DoorOpen} isLoading={isLoading} />
                <StatCard title="Tổng Khách thuê" value={stats?.totalTenants ?? 0} icon={Users} isLoading={isLoading} />
                <StatCard title="Hợp đồng sắp hết hạn" value={stats?.expiringContracts ?? 0} icon={FileWarning} isLoading={isLoading} description="Trong 30 ngày tới" />
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

                {/* Biểu đồ Doanh thu (chiếm 2/3 không gian) */}
                <div className="lg:col-span-2">
                    <RevenueChart data={data?.revenueByMonth} isLoading={isLoading} />
                </div>

                {/* Các danh sách nhanh (chiếm 1/3 không gian) */}
                <div className="space-y-6">
                    <QuickList
                        title="Sự cố cần xử lý"
                        description="Các sự cố đang chờ hoặc đang được giải quyết."
                        items={data?.pendingIncidents}
                        linkTo="/incidents"
                        icon={AlertTriangle} // Thêm icon
                        isLoading={isLoading}
                    />
                    <QuickList
                        title="Hợp đồng sắp hết hạn"
                        description="Các hợp đồng sẽ hết hạn trong 30 ngày tới."
                        items={data?.expiringContracts}
                        linkTo="/contracts"
                        icon={FileWarning} // Thêm icon
                        isLoading={isLoading}
                    />
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;