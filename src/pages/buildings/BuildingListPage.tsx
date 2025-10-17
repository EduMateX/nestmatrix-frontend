import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchBuildings, deleteBuilding, selectAllBuildings, selectBuildingsStatus, Building } from '@/store/buildings';
import { Column, DataTable } from '@/components/shared/DataTable';
import { Button } from '@/components/shared/Button';
import { Input } from '@/components/shared/Input';
import { ConfirmModal } from '@/components/shared/ConfirmModal';
import { Pencil, PlusCircle, Search, Trash2 } from 'lucide-react';
import toast from '@/lib/toast';

const BuildingListPage = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const buildings = useAppSelector(selectAllBuildings);
    const status = useAppSelector(selectBuildingsStatus);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(null);

    useEffect(() => {
        // Chỉ fetch 1 lần khi component mount
        if (status === 'idle') {
            dispatch(fetchBuildings());
        }
    }, [status, dispatch]);

    const handleOpenDeleteModal = (building: Building) => {
        setSelectedBuilding(building);
        setIsModalOpen(true);
    };

    const handleConfirmDelete = () => {
        if (selectedBuilding) {
            dispatch(deleteBuilding(selectedBuilding.id))
                .unwrap()
                .then(() => {
                    toast.success(`Đã xóa tòa nhà "${selectedBuilding.name}"`);
                    setIsModalOpen(false);
                })
                .catch((error) => {
                    toast.error(error);
                    setIsModalOpen(false);
                });
        }
    };

    // Định nghĩa các cột cho DataTable
    const columns: Column<Building>[] = [
        {
            header: 'Tên Tòa nhà',
            accessor: 'name',
            render: (building) => (
                <div className="flex items-center gap-3">
                    <img src={building.imageUrl || 'https://via.placeholder.com/40'} alt={building.name} className="h-10 w-10 rounded-md object-cover" />
                    <span className="font-medium">{building.name}</span>
                </div>
            )
        },
        { header: 'Địa chỉ', accessor: 'address' },
        {
            header: 'Actions',
            accessor: 'id',
            render: (building) => (
                <div className="flex gap-2">
                    <Button variant="secondary" size="sm" onClick={() => navigate(`/buildings/edit/${building.id}`)}>
                        <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="danger" size="sm" onClick={() => handleOpenDeleteModal(building)}>
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Quản lý Tòa nhà</h1>
                    <p className="text-muted-foreground">Tổng số {buildings.length} tòa nhà.</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input type="search" placeholder="Tìm kiếm..." className="pl-8" />
                    </div>
                    <Link to="/buildings/add">
                        <Button>
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Thêm mới
                        </Button>
                    </Link>
                </div>
            </div>

            <DataTable
                columns={columns}
                data={buildings}
                isLoading={status === 'loading'}
            />

            <ConfirmModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleConfirmDelete}
                title={`Xóa Tòa nhà: ${selectedBuilding?.name}`}
                description="Bạn có chắc chắn muốn xóa tòa nhà này không? Hành động này không thể hoàn tác."
                isLoading={false} // Có thể thêm state loading riêng cho việc xóa
            />
        </div>
    );
};

export default BuildingListPage;