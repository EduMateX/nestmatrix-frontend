import { useEffect, useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchRooms, deleteRoom, selectAllRooms, selectRoomsStatus, Room, RoomStatus } from '@/store/rooms';
import { selectAllBuildings } from '@/store/buildings';
import { Column, DataTable } from '@/components/shared/DataTable';
import { Button } from '@/components/shared/Button';
import { Input } from '@/components/shared/Input';
import { ConfirmModal } from '@/components/shared/ConfirmModal';
import { Pencil, PlusCircle, Search, Trash2 } from 'lucide-react';
import toast from '@/lib/toast';

const RoomListPage = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const rooms = useAppSelector(selectAllRooms);
    const buildings = useAppSelector(selectAllBuildings);
    const status = useAppSelector(selectRoomsStatus);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchRooms());
        }
    }, [status, dispatch]);

    // Tạo một map để tra cứu tên tòa nhà từ buildingId cho nhanh
    const buildingNameMap = useMemo(() => {
        return buildings.reduce((acc, building) => {
            acc[building.id] = building.name;
            return acc;
        }, {} as Record<number, string>);
    }, [buildings]);

    const handleOpenDeleteModal = (room: Room) => {
        setSelectedRoom(room);
        setIsModalOpen(true);
    };

    const handleConfirmDelete = () => {
        if (selectedRoom) {
            dispatch(deleteRoom(selectedRoom.id))
                .unwrap()
                .then(() => {
                    toast.success(`Đã xóa phòng "${selectedRoom.roomNumber}"`);
                    setIsModalOpen(false);
                })
                .catch((error) => {
                    toast.error(error);
                    setIsModalOpen(false);
                });
        }
    };

    const getStatusBadge = (status: RoomStatus) => {
        switch (status) {
            case RoomStatus.AVAILABLE:
                return <span className="bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full">Trống</span>
            case RoomStatus.RENTED:
                return <span className="bg-red-100 text-red-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full">Đã thuê</span>
            case RoomStatus.MAINTENANCE:
                return <span className="bg-yellow-100 text-yellow-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full">Bảo trì</span>
            default:
                return null;
        }
    }

    const columns: Column<Room>[] = [
        {
            header: 'Số phòng',
            accessor: 'roomNumber',
            render: (room) => <span className="font-medium">{room.roomNumber}</span>
        },
        {
            header: 'Tòa nhà',
            accessor: 'buildingId',
            render: (room) => <span>{buildingNameMap[room.buildingId] || 'N/A'}</span>
        },
        {
            header: 'Giá thuê (VND)',
            accessor: 'price',
            render: (room) => <span>{room.price.toLocaleString('vi-VN')}</span>
        },
        { header: 'Diện tích (m²)', accessor: 'area' },
        {
            header: 'Trạng thái',
            accessor: 'status',
            render: (room) => getStatusBadge(room.status)
        },
        {
            header: 'Actions',
            accessor: 'id',
            render: (room) => (
                <div className="flex gap-2">
                    <Button variant="secondary" size="sm" onClick={() => navigate(`/rooms/edit/${room.id}`)}>
                        <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="danger" size="sm" onClick={() => handleOpenDeleteModal(room)}>
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
                    <h1 className="text-2xl font-bold tracking-tight">Quản lý Phòng</h1>
                    <p className="text-muted-foreground">Tổng số {rooms.length} phòng.</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input type="search" placeholder="Tìm kiếm phòng..." className="pl-8" />
                    </div>
                    <Link to="/rooms/add">
                        <Button>
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Thêm phòng
                        </Button>
                    </Link>
                </div>
            </div>

            <DataTable
                columns={columns}
                data={rooms}
                isLoading={status === 'loading'}
            />

            <ConfirmModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleConfirmDelete}
                title={`Xóa Phòng: ${selectedRoom?.roomNumber}`}
                description="Bạn có chắc chắn muốn xóa phòng này không? Hành động này không thể hoàn tác."
            />
        </div>
    );
};

export default RoomListPage;