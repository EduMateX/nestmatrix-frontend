import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/shared/Card';
import { Skeleton } from '@/components/shared/Skeleton';
import { RevenueByMonth } from '@/store/dashboard';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface RevenueChartProps {
    data: RevenueByMonth[] | undefined;
    isLoading: boolean;
}

export const RevenueChart = ({ data, isLoading }: RevenueChartProps) => {
    return (
        <Card className="col-span-4">
            <CardHeader>
                <CardTitle>Doanh thu</CardTitle>
                <CardDescription>Doanh thu từ các hóa đơn đã thanh toán trong 6 tháng gần nhất.</CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
                {isLoading ? (
                    <div className="w-full h-[350px] p-4">
                        <Skeleton className="h-full w-full" />
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height={350}>
                        <BarChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="month" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${Number(value) / 1000000}tr`} />
                            <Tooltip
                                cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }}
                                contentStyle={{ background: 'white', border: '1px solid #ccc', borderRadius: '0.5rem' }}
                                labelStyle={{ fontWeight: 'bold' }}
                                formatter={(value) => [`${Number(value).toLocaleString('vi-VN')} VND`, 'Doanh thu']}
                            />
                            <Bar dataKey="totalRevenue" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                )}
            </CardContent>
        </Card>
    );
};