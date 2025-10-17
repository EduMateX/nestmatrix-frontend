import { useEffect, useState, useMemo, useCallback } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchBuildings, deleteBuilding, selectAllBuildings, selectBuildingsStatus, selectBuildingsPagination, Building } from '@/store/buildings';
import { Column, DataTable } from '@/components/shared/DataTable';
import { Button } from '@/components/shared/Button';
import { ConfirmModal } from '@/components/shared/ConfirmModal';
import { SearchInput } from '@/components/shared/SearchInput';
import toast from '@/lib/toast';
import { Pencil, PlusCircle, Trash2 } from 'lucide-react';

const BuildingListPage = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(null);

    const currentPage = Number(searchParams.get('page')) || 0;
    const currentKeyword = searchParams.get('keyword') || '';

    const buildings = useAppSelector(selectAllBuildings);
    const status = useAppSelector(selectBuildingsStatus);
    const pagination = useAppSelector(selectBuildingsPagination);

    useEffect(() => {
        dispatch(fetchBuildings({ page: currentPage, size: 10, keyword: currentKeyword }));
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

    const handleOpenDeleteModal = (building: Building) => {
        setSelectedBuilding(building);
        setIsModalOpen(true);
    };

    const handleConfirmDelete = () => {
        if (selectedBuilding) {
            dispatch(deleteBuilding(selectedBuilding.id))
                .unwrap()
                .then(() => toast.success(`Đã xóa tòa nhà "${selectedBuilding.name}"`))
                .catch((error) => toast.error(error as string))
                .finally(() => setIsModalOpen(false));
        }
    };

    const columns: Column<Building>[] = useMemo(() => [
        {
            header: 'Tên Tòa nhà',
            accessor: 'name',
            render: (building) => (
                <div className="flex items-center gap-4">
                    <img
                        src={building.imageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(building.name)}&background=random`}
                        alt={building.name}
                        className="h-12 w-12 rounded-lg object-cover"
                    />
                    <span className="font-medium text-gray-800">{building.name}</span>
                </div>
            )
        },
        { header: 'Địa chỉ', accessor: 'address' },
        {
            header: 'Hành động',
            accessor: 'id',
            render: (building) => (
                <div className="flex gap-2">
                    <Button variant="secondary" size="sm" onClick={() => navigate(`/buildings/edit/${building.id}`)} title="Chỉnh sửa">
                        <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="danger" size="sm" onClick={() => handleOpenDeleteModal(building)} title="Xóa">
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
                    <h1 className="text-2xl font-bold tracking-tight">Quản lý Tòa nhà</h1>
                    <p className="text-gray-500">Tổng số {pagination.totalElements} tòa nhà.</p>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-4">
                    <div className="w-full sm:w-64">
                        <SearchInput
                            initialValue={currentKeyword}
                            onSearchChange={handleSearch}
                            placeholder="Tìm theo tên tòa nhà..."
                        />
                    </div>
                    <Link to="/buildings/add" className="w-full sm:w-auto">
                        <Button className="w-full"><PlusCircle className="mr-2 h-4 w-4" />Thêm mới</Button>
                    </Link>
                </div>
            </div>

            <DataTable
                columns={columns}
                data={buildings}
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
                title={`Xóa Tòa nhà: ${selectedBuilding?.name}`}
                description="Bạn có chắc chắn muốn xóa tòa nhà này? Mọi dữ liệu liên quan sẽ bị ảnh hưởng. Hành động này không thể hoàn tác."
            />
        </div>
    );
};
export default BuildingListPage;