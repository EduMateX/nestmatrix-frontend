// src/pages/rooms/RoomFormPage.tsx
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { useBreadcrumb } from '@/context/BreadcrumbContext';
import {
    // createRoom, updateRoom, fetchRoomById, 
    selectRoomsStatus,
    selectAllRooms,
    resetStatus as resetRoomStatus
} from '@/store/rooms';
import { fetchBuildings, selectAllBuildings, selectBuildingsStatus } from '@/store/buildings';
import toast from '@/lib/toast';

import { Button } from '@/components/shared/Button';
import { Input } from '@/components/shared/Input';
import { Card, CardContent } from '@/components/shared/Card';
import { ArrowLeft } from 'lucide-react';
// Giả sử có component Select
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/shared/Select";

// Schema validation
const formSchema = z.object({
    roomNumber: z.string().min(1, 'Số phòng không được để trống'),
    buildingId: z.string().min(1, 'Vui lòng chọn tòa nhà'),
    price: z.preprocess(val => Number(val), z.number().min(1, 'Giá phòng phải lớn hơn 0')),
    area: z.preprocess(val => Number(val), z.number().min(1, 'Diện tích phải lớn hơn 0')),
    image: z.instanceof(FileList).optional(),
});
type FormValues = z.infer<typeof formSchema>;

const RoomFormPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { setDynamicSegment } = useBreadcrumb();

    const isEditMode = Boolean(id);
    const rooms = useAppSelector(selectAllRooms);
    const buildings = useAppSelector(selectAllBuildings);
    const roomStatus = useAppSelector(selectRoomsStatus);
    const buildingStatus = useAppSelector(selectBuildingsStatus);
    const isLoading = roomStatus === 'loading';

    const { register, handleSubmit, reset, control, formState: { errors } } = useForm<FormValues>({
        resolver: zodResolver(formSchema),
    });

    // Fetch buildings để hiển thị trong select dropdown
    useEffect(() => {
        if (buildingStatus === 'idle') {
            dispatch(fetchBuildings());
        }
    }, [buildingStatus, dispatch]);

    // Logic fetch dữ liệu và set breadcrumb
    useEffect(() => {
        if (isEditMode) {
            // Tương tự BuildingFormPage, fetch dữ liệu phòng và setDynamicSegment(room.roomNumber)
            setDynamicSegment(`Phòng ...`); // Placeholder
        } else {
            setDynamicSegment("Tạo phòng mới");
        }
        return () => {
            dispatch(resetRoomStatus());
            setDynamicSegment(null);
        };
    }, [id, isEditMode, dispatch, setDynamicSegment]);

    const onSubmit = (data: FormValues) => {
        console.log(data);
        // Logic dispatch createRoom hoặc updateRoom ở đây
        if (isEditMode) {
            toast.success('Cập nhật phòng thành công!');
        } else {
            toast.success('Tạo phòng thành công!');
        }
        navigate('/rooms');
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="secondary" size="sm" onClick={() => navigate(-1)}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <h1 className="text-2xl font-bold tracking-tight">
                    {isEditMode ? 'Chỉnh sửa Phòng' : 'Thêm Phòng mới'}
                </h1>
            </div>

            <Card>
                <CardContent className="pt-6">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="space-y-2">
                            <label>Tòa nhà</label>
                            <select {...register('buildingId')} className="w-full border rounded-md p-2">
                                <option value="">-- Chọn tòa nhà --</option>
                                {buildings.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                            </select>
                            {errors.buildingId && <p className="text-sm text-red-500">{errors.buildingId.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <label>Số phòng</label>
                            <Input {...register('roomNumber')} error={!!errors.roomNumber} />
                            {errors.roomNumber && <p className="text-sm text-red-500">{errors.roomNumber.message}</p>}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label>Giá thuê (VND/tháng)</label>
                                <Input type="number" {...register('price')} error={!!errors.price} />
                                {errors.price && <p className="text-sm text-red-500">{errors.price.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <label>Diện tích (m²)</label>
                                <Input type="number" {...register('area')} error={!!errors.area} />
                                {errors.area && <p className="text-sm text-red-500">{errors.area.message}</p>}
                            </div>
                        </div>

                        <div className="flex justify-end gap-2">
                            <Button type="button" variant="secondary" onClick={() => navigate('/rooms')}>Hủy</Button>
                            <Button type="submit" isLoading={isLoading}>
                                {isEditMode ? 'Lưu thay đổi' : 'Tạo mới'}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default RoomFormPage;