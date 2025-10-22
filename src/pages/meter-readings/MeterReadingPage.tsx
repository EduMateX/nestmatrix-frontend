import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';

// Redux
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchRooms, selectAllRooms, selectRoomsStatus, clearRooms, Room } from '@/store/rooms';
import { fetchBuildings, selectAllBuildings, selectBuildingsStatus } from '@/store/buildings';

// Components
import { Button } from '@/components/shared/Button';
import { Select, SelectOption } from '@/components/shared/Select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/shared/Card';
import { Spinner } from '@/components/shared/Spinner';
import { RecordReadingModal } from './RecordReadingModal';
import { History, Edit } from 'lucide-react';

const MeterReadingPage = () => {
    const dispatch = useAppDispatch();

    // State nội bộ của component
    const [selectedBuildingId, setSelectedBuildingId] = useState<number | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

    // State từ Redux
    const rooms = useAppSelector(selectAllRooms);
    const roomsStatus = useAppSelector(selectRoomsStatus);
    const buildings = useAppSelector(selectAllBuildings);
    const buildingsStatus = useAppSelector(selectBuildingsStatus);

    // Fetch danh sách tòa nhà (chỉ một lần)
    useEffect(() => {
        if (buildingsStatus === 'idle') {
            dispatch(fetchBuildings({ page: 0, size: 100 }));
        }
    }, [buildingsStatus, dispatch]);

    useEffect(() => {
        // Chỉ chạy khi đã fetch xong buildings và có dữ liệu
        if (buildingsStatus === 'succeeded' && buildings.length > 0) {
            // Nếu chưa có tòa nhà nào được chọn (lần đầu vào trang)
            if (selectedBuildingId === null) {
                // Tự động set ID của tòa nhà đầu tiên vào state
                setSelectedBuildingId(buildings[0].id);
            }
        }
    }, [buildings, buildingsStatus, selectedBuildingId]);

    useEffect(() => {
        if (selectedBuildingId) {
            dispatch(fetchRooms({
                page: 0,
                size: 200, // Lấy tất cả phòng trong tòa nhà
                buildingId: selectedBuildingId
            }));
        } else {
            dispatch(clearRooms());
        }
    }, [selectedBuildingId, dispatch]);

    const handleBuildingChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedBuildingId(Number(e.target.value) || null);
    }, []);

    const handleOpenModal = useCallback((room: Room) => {
        setSelectedRoom(room);
        setIsModalOpen(true);
    }, []);

    const buildingOptions: SelectOption[] = useMemo(() =>
        buildings.map(b => ({ value: b.id, label: b.name })),
        [buildings]
    );

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Ghi chỉ số Điện & Nước</h1>
                <p className="text-gray-500">Chọn tòa nhà, sau đó chọn phòng để ghi chỉ số hoặc xem lịch sử.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Chọn Tòa nhà</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="w-full md:w-1/3">
                        <Select
                            options={buildingOptions}
                            placeholder="-- Vui lòng chọn tòa nhà --"
                            value={selectedBuildingId || ''}
                            onChange={handleBuildingChange}
                            disabled={buildingsStatus === 'loading'}
                        />
                    </div>
                </CardContent>
            </Card>

            {selectedBuildingId && (
                <Card>
                    <CardHeader>
                        <CardTitle>Danh sách phòng</CardTitle>
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
                                    <div className="flex flex-col sm:flex-row gap-2">
                                        <Link to={`/meter-readings/history/${room.id}`}>
                                            <Button variant="secondary" size="sm" className="w-full">
                                                <History className="mr-2 h-4 w-4" />
                                                Lịch sử
                                            </Button>
                                        </Link>
                                        <Button size="sm" onClick={() => handleOpenModal(room)} className="w-full">
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