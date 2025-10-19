import { useEffect, useMemo, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

// Redux
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchInvoices, selectAllInvoices, selectInvoicesStatus, selectInvoicesPagination, Invoice, InvoiceStatus } from '@/store/invoices';
import { fetchBuildings, selectAllBuildings, selectBuildingsStatus } from '@/store/buildings';

// Components
import { Column, DataTable } from '@/components/shared/DataTable';
import { Button } from '@/components/shared/Button';
import { Select, SelectOption } from '@/components/shared/Select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/shared/Card';
import { Eye } from 'lucide-react';

const InvoiceListPage = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    // Filters state from URL
    const currentPage = Number(searchParams.get('page')) || 0;
    const buildingId = searchParams.get('buildingId') || undefined;
    const status = (searchParams.get('status') as InvoiceStatus) || undefined;

    // Redux state
    const invoices = useAppSelector(selectAllInvoices);
    const pagination = useAppSelector(selectInvoicesPagination);
    const invoicesStatus = useAppSelector(selectInvoicesStatus);
    const buildings = useAppSelector(selectAllBuildings);
    const buildingsStatus = useAppSelector(selectBuildingsStatus);

    // Fetch buildings cho filter
    useEffect(() => {
        if (buildingsStatus === 'idle') {
            dispatch(fetchBuildings({ page: 0, size: 100 }));
        }
    }, [dispatch, buildingsStatus]);

    // Tự động chọn tòa nhà đầu tiên
    useEffect(() => {
        if (buildingsStatus === 'succeeded' && buildings.length > 0 && !buildingId) {
            setSearchParams(prev => {
                prev.set('buildingId', String(buildings[0].id));
                return prev;
            }, { replace: true });
        }
    }, [buildings, buildingsStatus, buildingId, setSearchParams]);

    // Fetch invoices khi filters thay đổi
    useEffect(() => {
        if (buildingId) { // Chỉ fetch khi đã có buildingId
            dispatch(fetchInvoices({
                page: currentPage,
                size: 10,
                buildingId: Number(buildingId),
                status: status || undefined,
            }));
        }
    }, [dispatch, currentPage, buildingId, status]);

    const handleFilterChange = useCallback((key: string, value: string) => {
        setSearchParams(prev => {
            const newParams = new URLSearchParams(prev);
            if (value) {
                newParams.set(key, value);
            } else {
                newParams.delete(key);
            }
            newParams.set('page', '0'); // Reset page when filter changes
            return newParams;
        }, { replace: true });
    }, [setSearchParams]);

    const handlePageChange = useCallback((newPage: number) => {
        setSearchParams(prev => {
            const newParams = new URLSearchParams(prev);
            newParams.set('page', String(newPage));
            return newParams;
        }, { replace: true });
    }, [setSearchParams]);

    const getStatusBadge = (status: InvoiceStatus) => {
        const styles: Record<InvoiceStatus, string> = {
            [InvoiceStatus.PENDING]: "bg-orange-100 text-orange-800",
            [InvoiceStatus.WAITING_CONFIRMATION]: "bg-blue-100 text-blue-800",
            [InvoiceStatus.PAID]: "bg-green-100 text-green-800",
            [InvoiceStatus.OVERDUE]: "bg-red-100 text-red-800",
        };
        const text: Record<InvoiceStatus, string> = {
            [InvoiceStatus.PENDING]: "Chờ thanh toán",
            [InvoiceStatus.WAITING_CONFIRMATION]: "Chờ xác nhận",
            [InvoiceStatus.PAID]: "Đã thanh toán",
            [InvoiceStatus.OVERDUE]: "Quá hạn",
        };
        return <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${styles[status]}`}>{text[status]}</span>;
    };

    const columns: Column<Invoice>[] = useMemo(() => [
        { header: 'ID', accessor: 'id', render: (inv) => <span className="font-mono">#{inv.id}</span> },
        { header: 'Phòng', accessor: 'roomNumber', render: (inv) => <span className="font-medium">{inv.roomNumber}</span> },
        { header: 'Khách thuê', accessor: 'tenantName' },
        { header: 'Kỳ', accessor: 'periodMonth', render: (inv) => `${inv.periodMonth}/${inv.periodYear}` },
        { header: 'Tổng tiền (VND)', accessor: 'totalAmount', render: (inv) => inv.totalAmount.toLocaleString('vi-VN') },
        { header: 'Hạn TT', accessor: 'dueDate' },
        { header: 'Trạng thái', accessor: 'status', render: (inv) => getStatusBadge(inv.status) },
        {
            header: 'Hành động',
            accessor: 'id',
            render: (invoice) => (
                <Button variant="secondary" size="sm" onClick={() => navigate(`/invoices/${invoice.id}`)}>
                    <Eye className="mr-2 h-4 w-4" />
                    Xem
                </Button>
            ),
        },
    ], [navigate]);

    const buildingOptions: SelectOption[] = useMemo(() => buildings.map(b => ({ value: b.id, label: b.name })), [buildings]);
    const statusOptions: SelectOption[] = useMemo(() => Object.values(InvoiceStatus).map(s => ({ value: s, label: s })), []);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Quản lý Hóa đơn</h1>
                {/* Button tạo hóa đơn thủ công có thể thêm ở đây */}
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Bộ lọc</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="font-medium mb-2 block text-sm">Tòa nhà</label>
                        <Select options={buildingOptions} placeholder="Tất cả" value={buildingId || ''} onChange={e => handleFilterChange('buildingId', e.target.value)} />
                    </div>
                    <div>
                        <label className="font-medium mb-2 block text-sm">Trạng thái</label>
                        <Select options={statusOptions} placeholder="Tất cả" value={status || ''} onChange={e => handleFilterChange('status', e.target.value)} />
                    </div>
                </CardContent>
            </Card>

            <DataTable
                columns={columns}
                data={invoices}
                isLoading={invoicesStatus === 'loading'}
                pagination={{
                    currentPage: pagination.currentPage,
                    totalPages: pagination.totalPages,
                    totalElements: pagination.totalElements,
                    onPageChange: handlePageChange,
                }}
            />
        </div>
    );
};

export default InvoiceListPage;