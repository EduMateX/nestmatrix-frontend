import { useEffect, useState, useMemo, useCallback } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

// Redux
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
    fetchTenants,
    deleteTenant,
    selectAllTenants,
    selectTenantsStatus,
    selectTenantsPagination,
    Tenant
} from '@/store/tenants';

// Shared Components
import { Column, DataTable } from '@/components/shared/DataTable';
import { Button } from '@/components/shared/Button';
import { ConfirmModal } from '@/components/shared/ConfirmModal';
import { SearchInput } from '@/components/shared/SearchInput';

// Utils & Icons
import toast from '@/lib/toast';
import { Pencil, PlusCircle, Trash2 } from 'lucide-react';

const TenantListPage = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    // State nội bộ cho modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);

    // Đọc state từ URL params
    const currentPage = Number(searchParams.get('page')) || 0;
    const currentKeyword = searchParams.get('keyword') || '';

    // Redux State
    const tenants = useAppSelector(selectAllTenants);
    const status = useAppSelector(selectTenantsStatus);
    const pagination = useAppSelector(selectTenantsPagination);


    useEffect(() => {
        dispatch(fetchTenants({ page: currentPage, size: 10, keyword: currentKeyword }));
    }, [dispatch, currentPage, currentKeyword]);

    const handlePageChange = useCallback((newPage: number) => {
        setSearchParams(prev => {
            prev.set('page', String(newPage));
            return prev;
        }, { replace: true });
    }, [setSearchParams]);

    const handleSearch = useCallback((keyword: string) => {
        setSearchParams(prev => {
            prev.set('page', '0');
            if (keyword) {
                prev.set('keyword', keyword);
            } else {
                prev.delete('keyword');
            }
            return prev;
        }, { replace: true });
    }, [setSearchParams]);

    // Modal handlers
    const handleOpenDeleteModal = (tenant: Tenant) => {
        setSelectedTenant(tenant);
        setIsModalOpen(true);
    };

    const handleConfirmDelete = () => {
        if (selectedTenant) {
            dispatch(deleteTenant(selectedTenant.id))
                .unwrap()
                .then(() => {
                    toast.success(`Đã xóa khách thuê "${selectedTenant.fullName}"`);
                    // Dispatch lại action fetch để làm mới dữ liệu
                    dispatch(fetchTenants({ page: currentPage, size: 10, keyword: currentKeyword }));
                })
                .catch((error) => toast.error(error as string))
                .finally(() => setIsModalOpen(false));
        }
    };

    // Columns definition for the DataTable
    const columns: Column<Tenant>[] = useMemo(() => [
        { header: 'Họ và tên', accessor: 'fullName', render: (t) => <span className="font-medium text-gray-800">{t.fullName}</span> },
        { header: 'Số điện thoại', accessor: 'phoneNumber' },
        { header: 'Email', accessor: 'email' },
        { header: 'Số CCCD', accessor: 'citizenId' },
        {
            header: 'Hành động',
            accessor: 'id',
            render: (tenant) => (
                <div className="flex gap-2">
                    <Button variant="secondary" size="sm" onClick={() => navigate(`/tenants/edit/${tenant.id}`)} title="Chỉnh sửa">
                        <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="danger" size="sm" onClick={() => handleOpenDeleteModal(tenant)} title="Xóa">
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            ),
        },
    ], [navigate]);

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Quản lý Khách thuê</h1>
                    <p className="text-gray-500">Tổng số {pagination.totalElements} khách thuê.</p>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-4">
                    <div className="w-full sm:w-64">
                        <SearchInput
                            initialValue={currentKeyword}
                            onSearchChange={handleSearch}
                            placeholder="Tìm theo tên hoặc SĐT..."
                        />
                    </div>
                    <Link to="/tenants/add" className="w-full sm:w-auto">
                        <Button className="w-full">
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Thêm khách thuê
                        </Button>
                    </Link>
                </div>
            </div>

            <DataTable
                columns={columns}
                data={tenants}
                isLoading={status === 'loading'}
                pagination={{
                    currentPage: pagination.currentPage,
                    totalPages: pagination.totalPages,
                    totalElements: pagination.totalElements,
                    onPageChange: handlePageChange,
                }}
            />

            <ConfirmModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleConfirmDelete}
                title={`Xóa Khách thuê: ${selectedTenant?.fullName}`}
                description="Bạn có chắc chắn muốn xóa khách thuê này? Hành động này không thể hoàn tác."
            />
        </div>
    );
};

export default TenantListPage;