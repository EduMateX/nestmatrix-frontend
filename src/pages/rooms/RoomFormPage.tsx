import { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { useBreadcrumb } from '@/context/BreadcrumbContext';
import { createRoom, updateRoom, fetchRoomById, selectRoomsStatus, selectRoomById, resetStatus as resetRoomStatus } from '@/store/rooms';
import { fetchBuildings, selectAllBuildings, selectBuildingsStatus } from '@/store/buildings';
import toast from '@/lib/toast';

import { Button } from '@/components/shared/Button';
import { Input } from '@/components/shared/Input';
import { Select, SelectOption } from '@/components/shared/Select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/shared/Card';
import { ArrowLeft } from 'lucide-react';
import { Spinner } from '@/components/shared/Spinner';

const formSchema = z.object({
    roomNumber: z.string().min(1, 'Số phòng không được để trống'),
    buildingId: z.preprocess(val => Number(val), z.number().min(1, 'Vui lòng chọn tòa nhà')),
    price: z.preprocess(val => Number(val), z.number().min(1, 'Giá phòng phải lớn hơn 0')),
    area: z.preprocess(val => Number(val), z.number().min(1, 'Diện tích phải lớn hơn 0')),
    image: z.instanceof(FileList).optional(),
});
type FormValues = z.infer<typeof formSchema>;

const RoomFormPage = () => {
    const { id } = useParams<{ id: string }>();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { setDynamicSegment } = useBreadcrumb();

    const isEditMode = Boolean(id);
    const roomId = isEditMode ? Number(id) : undefined;

    const buildingIdFromQuery = searchParams.get('buildingId');

    const room = useAppSelector(selectRoomById(roomId || -1));
    const buildings = useAppSelector(selectAllBuildings);
    const roomStatus = useAppSelector(selectRoomsStatus);
    const buildingStatus = useAppSelector(selectBuildingsStatus);

    const isLoading = roomStatus === 'loading';
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm<FormValues>({
        resolver: zodResolver(formSchema),
    });

    useEffect(() => {
        if (buildingStatus === 'idle') {
            dispatch(fetchBuildings());
        }
    }, [buildingStatus, dispatch]);

    useEffect(() => {
        if (isEditMode) {
            if (room) {
                reset({ roomNumber: room.roomNumber, buildingId: room.buildingId, price: room.price, area: room.area });
                setDynamicSegment(room.roomNumber);
                if (room.imageUrl) setImagePreview(room.imageUrl);
            } else if (roomId) {
                dispatch(fetchRoomById(roomId)).unwrap().then((fetchedRoom) => {
                    reset({ roomNumber: fetchedRoom.roomNumber, buildingId: fetchedRoom.buildingId, price: fetchedRoom.price, area: fetchedRoom.area });
                    setDynamicSegment(fetchedRoom.roomNumber);
                    if (fetchedRoom.imageUrl) setImagePreview(fetchedRoom.imageUrl);
                }).catch(() => {
                    toast.error('Không tìm thấy thông tin phòng.');
                    navigate('/rooms');
                });
            }
        } else {
            setDynamicSegment("Tạo phòng mới");
            if (buildingIdFromQuery) {
                setValue('buildingId', Number(buildingIdFromQuery));
            }
        }
        return () => {
            dispatch(resetRoomStatus());
            setDynamicSegment(null);
        };
    }, [id, isEditMode, room, buildingIdFromQuery, dispatch, reset, setValue, setDynamicSegment, navigate]);

    const imageFile = watch('image');
    useEffect(() => {
        if (imageFile && imageFile.length > 0) {
            const file = imageFile[0];
            const previewUrl = URL.createObjectURL(file);
            setImagePreview(previewUrl);
            return () => URL.revokeObjectURL(previewUrl);
        }
    }, [imageFile]);

    const onSubmit = (data: FormValues) => {
        const payload = { ...data, image: data.image?.[0] };

        const action = isEditMode
            ? updateRoom({ ...payload, id: roomId! })
            : createRoom(payload);

        dispatch(action).unwrap().then(() => {
            toast.success(isEditMode ? 'Cập nhật phòng thành công!' : 'Tạo phòng thành công!');
            navigate(`/rooms?buildingId=${data.buildingId}`);
        }).catch(error => toast.error(error as string));
    };

    if (isEditMode && !room && roomStatus === 'loading') {
        return (
            <div className="flex justify-center items-center h-64"><Spinner size="lg" /></div>
        );
    }

    const buildingOptions: SelectOption[] = buildings.map(b => ({ value: b.id, label: b.name }));

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="secondary" size="sm" onClick={() => navigate(-1)}><ArrowLeft className="h-4 w-4" /></Button>
                <h1 className="text-2xl font-bold tracking-tight">{isEditMode ? 'Chỉnh sửa Phòng' : 'Thêm Phòng mới'}</h1>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Thông tin phòng</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="space-y-2">
                            <label htmlFor="buildingId" className="font-medium">Tòa nhà</label>
                            <Select
                                id="buildingId"
                                options={buildingOptions}
                                placeholder="-- Chọn tòa nhà --"
                                {...register('buildingId')}
                                error={!!errors.buildingId}
                                disabled={isEditMode || isLoading || buildingStatus === 'loading'}
                            />
                            {errors.buildingId && <p className="text-sm text-red-500 mt-1">{errors.buildingId.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="roomNumber" className="font-medium">Số phòng</label>
                            <Input id="roomNumber" {...register('roomNumber')} error={!!errors.roomNumber} disabled={isLoading} />
                            {errors.roomNumber && <p className="text-sm text-red-500 mt-1">{errors.roomNumber.message}</p>}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label htmlFor="price" className="font-medium">Giá thuê (VND/tháng)</label>
                                <Input id="price" type="number" {...register('price')} error={!!errors.price} disabled={isLoading} />
                                {errors.price && <p className="text-sm text-red-500 mt-1">{errors.price.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="area" className="font-medium">Diện tích (m²)</label>
                                <Input id="area" type="number" {...register('area')} error={!!errors.area} disabled={isLoading} />
                                {errors.area && <p className="text-sm text-red-500 mt-1">{errors.area.message}</p>}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="image" className="font-medium">Ảnh đại diện</label>
                            {imagePreview && <img src={imagePreview} alt="Xem trước ảnh" className="h-32 w-32 rounded-md object-cover border" />}
                            <Input id="image" type="file" accept="image/*" {...register('image')} disabled={isLoading} />
                        </div>

                        <div className="flex justify-end gap-2 pt-4">
                            <Button type="button" variant="secondary" onClick={() => navigate(-1)}>Hủy</Button>
                            <Button type="submit" isLoading={isLoading}>{isEditMode ? 'Lưu thay đổi' : 'Tạo mới'}</Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default RoomFormPage;