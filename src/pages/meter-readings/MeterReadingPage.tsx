import { useEffect, useState, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { Link } from 'react-router-dom';

// Redux
import {
    fetchRooms,
    selectAllRooms,
    selectRoomsStatus,
    Room,
    clearRooms
} from '@/store/rooms';
import {
    fetchBuildings,
    selectAllBuildings,
    selectBuildingsStatus
} from '@/store/buildings';

// Components
import { Select, SelectOption } from '@/components/shared/Select';
import { Button } from '@/components/shared/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/shared/Card';
import { RecordReadingModal } from './RecordReadingModal';
import { Spinner } from '@/components/shared/Spinner';
import { History, Edit } from 'lucide-react';

const MeterReadingPage = () => {
    const dispatch = useAppDispatch();
    const [selectedBuildingId, setSelectedBuildingId] = useState<number | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

    // Redux State
    const rooms = useAppSelector(selectAllRooms);
    const roomsStatus = useAppSelector(selectRoomsStatus);
    const buildings = useAppSelector(selectAllBuildings);
    const buildingsStatus = useAppSelector(selectBuildingsStatus);

    // Fetch buildings cho dropdown
    useEffect(() => {
        if (buildingsStatus === 'idle') {
            // Lấy tất cả tòa nhà (giả sử số lượng không quá lớn)
            dispatch(fetchBuildings({ page: 0, size: 100 }));
        }
    }, [buildingsStatus, dispatch]);

    // Fetch rooms khi building được chọn
    useEffect(() => {
        if (selectedBuildingId) {
            // SỬA LỖI 2: Gọi action `fetchRooms` với payload đúng
            dispatch(fetchRooms({
                page: 0,
                size: 100, // Lấy tất cả phòng trong tòa nhà
                buildingId: selectedBuildingId
            }));
        } else {
            dispatch(clearRooms());
        }
    }, [selectedBuildingId, dispatch]);

    const handleOpenModal = (room: Room) => {
        setSelectedRoom(room);
        setIsModalOpen(true);
    };

    // Tạo options cho dropdown tòa nhà
    const buildingOptions: SelectOption[] = useMemo(() =>
        buildings.map(b => ({ value: b.id, label: b.name })),
        [buildings]
    );

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">Ghi chỉ số Điện & Nước</h1>

            <Card>
                <CardHeader>
                    <CardTitle>Chọn Tòa nhà</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="w-full md:w-1/3">
                        <Select
                            options={buildingOptions}
                            placeholder="-- Vui lòng chọn tòa nhà --"
                            onChange={(e) => setSelectedBuildingId(Number(e.target.value) || null)}
                            disabled={buildingsStatus === 'loading'}
                        />
                    </div>
                </CardContent>
            </Card>

            {selectedBuildingId && (
                <Card>
                    <CardHeader>
                        <CardTitle>Danh sách phòng</CardTitle>
                        <p className="text-sm text-muted-foreground">Chọn phòng để ghi chỉ số cho tháng hiện tại hoặc xem lịch sử.</p>
                    </CardHeader>
                    <CardContent>
                        {roomsStatus === 'loading' && (
                            <div className="flex justify-center py-8"><Spinner /></div>
                        )}
                        {roomsStatus === 'succeeded' && rooms.length === 0 && (
                            <p className="text-center text-gray-500 py-8">Tòa nhà này chưa có phòng nào.</p>
                        )}
                        <div className="divide-y divide-gray-200">
                            {rooms.map(room => (
                                <div key={room.id} className="flex items-center justify-between py-4">
                                    <div>
                                        <p className="font-semibold text-lg">{room.roomNumber}</p>
                                        <p className="text-sm text-gray-500">Trạng thái: {room.status}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <Link to={`/meter-readings/history/${room.id}`}>
                                            <Button variant="secondary" size="sm">
                                                <History className="mr-2 h-4 w-4" />
                                                Lịch sử
                                            </Button>
                                        </Link>
                                        <Button size="sm" onClick={() => handleOpenModal(room)}>
                                            <Edit className="mr-2 h-4 w-4" />
                                            Ghi chỉ số
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            <RecordReadingModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                room={selectedRoom}
            />
        </div>
    );
};

export default MeterReadingPage;