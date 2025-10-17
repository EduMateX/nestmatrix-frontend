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

    // --- QUẢN LÝ STATE CHO FILTER VÀ SEARCH ---
    // Đọc giá trị ban đầu từ URL, sau đó component sẽ tự quản lý
    const [selectedBuildingId, setSelectedBuildingId] = useState(() => searchParams.get('buildingId') || '');
    const [keyword, setKeyword] = useState(() => searchParams.get('keyword') || '');
    const [page, setPage] = useState(() => Number(searchParams.get('page')) || 0);

    // Redux State
    const rooms = useAppSelector(selectAllRooms);
    const roomsStatus = useAppSelector(selectRoomsStatus);
    const pagination = useAppSelector(selectRoomsPagination);
    const buildings = useAppSelector(selectAllBuildings);
    const buildingsStatus = useAppSelector(selectBuildingsStatus);

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

    // --- CHỈ CÓ MỘT useEffect ĐỂ FETCH DỮ LIỆU CHÍNH ---
    useEffect(() => {
        // Luôn fetch danh sách tòa nhà
        dispatch(fetchBuildings({ page: 0, size: 100 }));

        // Nếu có một tòa nhà được chọn, thì fetch danh sách phòng
        const buildingId = Number(selectedBuildingId);
        if (buildingId > 0) {
            dispatch(fetchRooms({
                page,
                size: 10,
                buildingId: buildingId,
                keyword,
            }));
        } else {
            // Nếu không có, đảm bảo danh sách phòng trống
            dispatch(clearRooms());
        }

        // Cập nhật lại URLSearchParams để đồng bộ
        const newSearchParams = new URLSearchParams();
        if (selectedBuildingId) newSearchParams.set('buildingId', selectedBuildingId);
        if (keyword) newSearchParams.set('keyword', keyword);
        if (page > 0) newSearchParams.set('page', String(page));
        setSearchParams(newSearchParams, { replace: true });

    }, [dispatch, selectedBuildingId, keyword, page]); // Dependency array rất rõ ràng

    // Handlers
    const handleBuildingChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedBuildingId(e.target.value);
        setKeyword(''); // Reset keyword khi đổi tòa nhà
        setPage(0); // Reset về trang đầu
    };

    const handleSearch = (newKeyword: string) => {
        setKeyword(newKeyword);
        setPage(0); // Reset về trang đầu
    };

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
    };

    const handleOpenDeleteModal = (room: Room) => {
        setSelectedRoom(room);
        setIsModalOpen(true);
    };

    const handleConfirmDelete = () => {
        if (selectedRoom) {
            dispatch(deleteRoom(selectedRoom.id))
                .unwrap()
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
        }
        return <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${styles[status]}`}>{text[status]}</span>;
    };

    const buildingNameMap = useMemo(() => {
        return buildings.reduce((acc, b) => ({ ...acc, [b.id]: b.name }), {} as Record<number, string>);
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
                        {selectedBuildingId ? `Tổng số ${pagination.totalElements} phòng.` : "Vui lòng chọn một tòa nhà."}
                    </p>
                </div>
                <Link to={selectedBuildingId ? `/rooms/add?buildingId=${selectedBuildingId}` : '/rooms/add'}>
                    <Button disabled={!selectedBuildingId}><PlusCircle className="mr-2 h-4 w-4" /> Thêm phòng mới</Button>
                </Link>
            </div>

            <Card>
                <CardContent className="pt-6 flex flex-col md:flex-row gap-4 items-end">
                    <div className="w-full md:w-1/3">
                        <label className="font-medium mb-2 block">Tòa nhà</label>
                        <Select
                            options={buildingOptions}
                            placeholder="-- Chọn tòa nhà --"
                            value={selectedBuildingId}
                            onChange={handleBuildingChange}
                            disabled={buildingsStatus === 'loading'}
                        />
                    </div>
                    <div className="w-full md:w-1/3">
                        <label className="font-medium mb-2 block">Tìm theo số phòng</label>
                        <SearchInput
                            // Sử dụng key để reset component khi đổi tòa nhà
                            key={selectedBuildingId}
                            initialValue={keyword}
                            onSearchChange={handleSearch}
                            placeholder="Nhập số phòng..."
                            debounceDelay={500}
                            disabled={!selectedBuildingId}
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
                description="Bạn có chắc chắn muốn xóa phòng này?"
            />
        </div>
    );
};

export default RoomListPage;