import { useEffect, useState, useMemo } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

// Redux
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
    fetchRooms,
    deleteRoom,
    selectAllRooms,
    selectRoomsStatus,
    selectRoomsPagination,
    clearRooms,
    Room,
    RoomStatus
} from '@/store/rooms';
import { fetchBuildings, selectAllBuildings, selectBuildingsStatus } from '@/store/buildings';

// Shared Components
import { Column, DataTable } from '@/components/shared/DataTable';
import { Button } from '@/components/shared/Button';
import { ConfirmModal } from '@/components/shared/ConfirmModal';
import { Select, SelectOption } from '@/components/shared/Select';
import { SearchInput } from '@/components/shared/SearchInput';
import { Card, CardContent } from '@/components/shared/Card';

// Utils & Icons
import toast from '@/lib/toast';
import { Pencil, PlusCircle, Trash2 } from 'lucide-react';

const RoomListPage = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

    const [keyword, setKeyword] = useState(() => searchParams.get('keyword') || '');

    const currentPage = Number(searchParams.get('page')) || 0;
    const selectedBuildingId = searchParams.get('buildingId');

    const rooms = useAppSelector(selectAllRooms);
    const roomsStatus = useAppSelector(selectRoomsStatus);
    const pagination = useAppSelector(selectRoomsPagination);
    const buildings = useAppSelector(selectAllBuildings);
    const buildingsStatus = useAppSelector(selectBuildingsStatus);

    useEffect(() => {
        if (buildingsStatus === 'idle') {
            dispatch(fetchBuildings({ page: 0, size: 100 }));
        }
    }, [buildingsStatus, dispatch]);

    useEffect(() => {
        const buildingId = selectedBuildingId ? Number(selectedBuildingId) : undefined;

        if (buildingId) {
            dispatch(fetchRooms({
                page: currentPage,
                size: 10,
                buildingId: buildingId,
                keyword: keyword,
            }));
        } else {
            dispatch(clearRooms());
        }
    }, [dispatch, currentPage, keyword, selectedBuildingId]);

    const handlePageChange = (newPage: number) => {
        setSearchParams(prev => {
            const params = Object.fromEntries(prev);
            return { ...params, page: String(newPage) };
        });
    };

    const handleBuildingChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSearchParams({ buildingId: e.target.value, page: '0', keyword });
    };

    const handleSearch = (newKeyword: string) => {
        setKeyword(newKeyword);
        setSearchParams(prev => {
            const params = Object.fromEntries(prev);
            return { ...params, page: '0', keyword: newKeyword };
        });
    };

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
                    if (selectedBuildingId) {
                        dispatch(fetchRooms({ page: currentPage, size: 10, buildingId: Number(selectedBuildingId), keyword }));
                    }
                })
                .catch((error) => toast.error(error as string))
                .finally(() => setIsModalOpen(false));
        }
    };

    const getStatusBadge = (status: RoomStatus) => {
        const styles: Record<RoomStatus, string> = {
            [RoomStatus.AVAILABLE]: "bg-green-100 text-green-800",
            [RoomStatus.RENTED]: "bg-red-100 text-red-800",
            [RoomStatus.MAINTENANCE]: "bg-yellow-100 text-yellow-800",
        };
        const text: Record<RoomStatus, string> = {
            [RoomStatus.AVAILABLE]: "Trống",
            [RoomStatus.RENTED]: "Đã thuê",
            [RoomStatus.MAINTENANCE]: "Bảo trì",
        }
        return <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${styles[status]}`}>{text[status]}</span>;
    };

    const buildingNameMap = useMemo(() => {
        return buildings.reduce((acc, building) => {
            acc[building.id] = building.name;
            return acc;
        }, {} as Record<number, string>);
    }, [buildings]);

    const columns: Column<Room>[] = useMemo(() => [
        {
            header: 'Số phòng',
            accessor: 'roomNumber',
            render: (r) => <span className="font-medium text-gray-800">{r.roomNumber}</span>
        },
        {
            header: 'Tòa nhà',
            accessor: 'buildingId',
            render: (r) => <span>{buildingNameMap[r.buildingId] || 'N/A'}</span>
        },
        {
            header: 'Giá thuê (VND)',
            accessor: 'price',
            render: (r) => <span>{r.price.toLocaleString('vi-VN')}</span>
        },
        {
            header: 'Diện tích (m²)',
            accessor: 'area'
        },
        {
            header: 'Trạng thái',
            accessor: 'status',
            render: (r) => getStatusBadge(r.status)
        },
        {
            header: 'Hành động',
            accessor: 'id',
            render: (room) => (
                <div className="flex gap-2">
                    <Button variant="secondary" size="sm" onClick={() => navigate(`/rooms/edit/${room.id}`)} title="Chỉnh sửa">
                        <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="danger" size="sm" onClick={() => handleOpenDeleteModal(room)} title="Xóa">
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            ),
        },
    ], [navigate, buildingNameMap]);

    const buildingOptions: SelectOption[] = useMemo(() => buildings.map(b => ({ value: b.id, label: b.name })), [buildings]);

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Quản lý Phòng</h1>
                    <p className="text-gray-500">
                        {selectedBuildingId ? `Tổng số ${pagination.totalElements} phòng.` : "Vui lòng chọn một tòa nhà để xem danh sách."}
                    </p>
                </div>
                <Link to={selectedBuildingId ? `/rooms/add?buildingId=${selectedBuildingId}` : '/rooms/add'}>
                    <Button disabled={!selectedBuildingId}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Thêm phòng mới
                    </Button>
                </Link>
            </div>

            <Card>
                <CardContent className="pt-6 flex flex-col md:flex-row gap-4 items-end">
                    <div className="w-full md:w-1/3">
                        <label className="font-medium mb-2 block">Tòa nhà</label>
                        <Select
                            options={buildingOptions}
                            placeholder="-- Chọn tòa nhà --"
                            value={selectedBuildingId || ""}
                            onChange={handleBuildingChange}
                            disabled={buildingsStatus === 'loading'}
                        />
                    </div>
                    <div className="w-full md:w-1/3">
                        <label className="font-medium mb-2 block">Tìm theo số phòng</label>
                        <SearchInput
                            initialValue={keyword}
                            onSearchChange={handleSearch}
                            placeholder="Nhập số phòng..."
                            debounceDelay={500}
                        />
                    </div>
                </CardContent>
            </Card>

            {selectedBuildingId && (
                <DataTable
                    columns={columns}
                    data={rooms}
                    isLoading={roomsStatus === 'loading'}
                    pagination={{
                        currentPage: pagination.currentPage,
                        totalPages: pagination.totalPages,
                        totalElements: pagination.totalElements,
                        onPageChange: handlePageChange,
                    }}
                />
            )}

            <ConfirmModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleConfirmDelete}
                title={`Xóa Phòng: ${selectedRoom?.roomNumber}`}
                description="Bạn có chắc chắn muốn xóa phòng này? Hành động này không thể hoàn tác."
            />
        </div>
    );
};

export default RoomListPage;