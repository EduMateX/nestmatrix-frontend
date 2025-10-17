import { useEffect, useState, useMemo, useCallback } from 'react';
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

    // State nội bộ cho modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

    // Đọc state từ URL params
    const currentPage = Number(searchParams.get('page')) || 0;
    const buildingId = searchParams.get('buildingId') || '';
    const keyword = searchParams.get('keyword') || '';

    // Redux State
    const rooms = useAppSelector(selectAllRooms);
    const roomsStatus = useAppSelector(selectRoomsStatus);
    const pagination = useAppSelector(selectRoomsPagination);
    const buildings = useAppSelector(selectAllBuildings);
    const buildingsStatus = useAppSelector(selectBuildingsStatus);

    // Fetch buildings cho dropdown
    useEffect(() => {
        if (buildingsStatus === 'idle') {
            dispatch(fetchBuildings({ page: 0, size: 100 }));
        }
    }, [buildingsStatus, dispatch]);

    // Fetch rooms khi các tham số URL thay đổi
    useEffect(() => {
        if (buildingId) {
            dispatch(fetchRooms({
                page: currentPage,
                size: 10,
                buildingId: Number(buildingId),
                keyword: keyword,
                // Không còn filter và sort
            }));
        } else {
            dispatch(clearRooms());
        }
    }, [dispatch, currentPage, keyword, buildingId]);

    // --- Handlers ---
    const handlePageChange = useCallback((newPage: number) => {
        setSearchParams(prev => {
            prev.set('page', String(newPage));
            return prev;
        }, { replace: true });
    }, [setSearchParams]);

    const handleBuildingChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
        const newBuildingId = e.target.value;
        // Khi đổi tòa nhà, reset page và keyword
        setSearchParams({ buildingId: newBuildingId, page: '0', keyword: '' });
    }, [setSearchParams]);

    const handleSearch = useCallback((newKeyword: string) => {
        setSearchParams(prev => {
            prev.set('page', '0'); // Reset page khi tìm kiếm
            if (newKeyword) {
                prev.set('keyword', newKeyword);
            } else {
                prev.delete('keyword');
            }
            return prev;
        }, { replace: true });
    }, [setSearchParams]);

    const handleOpenDeleteModal = (room: Room) => {
        setSelectedRoom(room);
        setIsModalOpen(true);
    };

    const handleConfirmDelete = () => {
        if (selectedRoom) {
            dispatch(deleteRoom(selectedRoom.id)).unwrap()
                .then(() => toast.success(`Đã xóa phòng "${selectedRoom.roomNumber}"`))
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
        };
        return <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${styles[status]}`}>{text[status]}</span>;
    };

    const buildingNameMap = useMemo(() => buildings.reduce((acc, b) => ({ ...acc, [b.id]: b.name }), {} as Record<number, string>), [buildings]);

    const columns: Column<Room>[] = useMemo(() => [
        { header: 'Số phòng', accessor: 'roomNumber', render: (r) => <span className="font-medium">{r.roomNumber}</span> },
        { header: 'Tòa nhà', accessor: 'buildingId', render: (r) => <span>{buildingNameMap[r.buildingId] || 'N/A'}</span> },
        { header: 'Giá thuê (VND)', accessor: 'price', render: (r) => r.price.toLocaleString('vi-VN') },
        { header: 'Diện tích (m²)', accessor: 'area' },
        { header: 'Trạng thái', accessor: 'status', render: (r) => getStatusBadge(r.status) },
        {
            header: 'Hành động', accessor: 'actions', render: (room) => (
                <div className="flex gap-2">
                    <Button variant="secondary" size="sm" onClick={() => navigate(`/rooms/edit/${room.id}`)}><Pencil className="h-4 w-4" /></Button>
                    <Button variant="danger" size="sm" onClick={() => handleOpenDeleteModal(room)}><Trash2 className="h-4 w-4" /></Button>
                </div>
            )
        },
    ], [navigate, buildingNameMap, handleOpenDeleteModal]);

    const buildingOptions: SelectOption[] = useMemo(() => buildings.map(b => ({ value: b.id, label: b.name })), [buildings]);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold">Quản lý Phòng</h1>
                    <p className="text-gray-500">{buildingId ? `Tổng số ${pagination.totalElements} phòng.` : "Vui lòng chọn một tòa nhà."}</p>
                </div>
                <Link to={buildingId ? `/rooms/add?buildingId=${buildingId}` : '/rooms/add'}>
                    <Button disabled={!buildingId}><PlusCircle className="mr-2 h-4 w-4" /> Thêm phòng</Button>
                </Link>
            </div>

            <Card>
                <CardContent className="pt-6 flex flex-col md:flex-row gap-4 items-end">
                    <div className="w-full md:w-1/3">
                        <label className="font-medium mb-2 block">Tòa nhà</label>
                        <Select
                            options={buildingOptions}
                            placeholder="-- Chọn tòa nhà --"
                            value={buildingId || ""}
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
                            disabled={!buildingId}
                        />
                    </div>
                </CardContent>
            </Card>

            {buildingId && (
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
                // Không còn props sort và onSort
                />
            )}

            <ConfirmModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleConfirmDelete}
                title={`Xóa Phòng: ${selectedRoom?.roomNumber}`}
                description="Bạn có chắc chắn muốn xóa phòng này?"
            />
        </div>
    );
};

export default RoomListPage;