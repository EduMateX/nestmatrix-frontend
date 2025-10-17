// src/pages/buildings/BuildingFormPage.tsx
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
    createBuilding,
    updateBuilding,
    fetchBuildingById,
    selectBuildingsStatus,
    selectAllBuildings,
    resetStatus
} from '@/store/buildings';
import toast from '@/lib/toast';

import { Button } from '@/components/shared/Button';
import { Input } from '@/components/shared/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/shared/Card';
import { ArrowLeft } from 'lucide-react';
import { useBreadcrumb } from '@/context/BreadcrumbContext';

// Schema validation cho form
const formSchema = z.object({
    name: z.string().min(3, { message: 'Tên tòa nhà phải có ít nhất 3 ký tự.' }),
    address: z.string().min(5, { message: 'Địa chỉ phải có ít nhất 5 ký tự.' }),
    image: z.instanceof(FileList).optional(),
});
type FormValues = z.infer<typeof formSchema>;

const BuildingFormPage = () => {
    const { id } = useParams<{ id: string }>(); // Lấy ID từ URL
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { setDynamicSegment } = useBreadcrumb();

    const isEditMode = Boolean(id);
    const buildings = useAppSelector(selectAllBuildings);
    const status = useAppSelector(selectBuildingsStatus);
    const isLoading = status === 'loading';

    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const { register, handleSubmit, reset, watch, formState: { errors } } = useForm<FormValues>({
        resolver: zodResolver(formSchema),
    });

    // Theo dõi sự thay đổi của input file
    const imageFile = watch('image');
    useEffect(() => {
        if (imageFile && imageFile.length > 0) {
            const file = imageFile[0];
            setImagePreview(URL.createObjectURL(file));
        }
    }, [imageFile]);

    // Lấy dữ liệu khi ở chế độ Edit
    useEffect(() => {
        // Reset breadcrumb khi component unmount
        return () => setDynamicSegment(null);
    }, [setDynamicSegment]);


    // Lấy dữ liệu khi ở chế độ Edit
    useEffect(() => {
        if (isEditMode) {
            const buildingId = Number(id);
            // Tìm trong store trước
            const existingBuilding = buildings.find(b => b.id === buildingId);
            if (existingBuilding) {
                reset({ name: existingBuilding.name, address: existingBuilding.address });
                setImagePreview(existingBuilding.imageUrl || null);
                setDynamicSegment(existingBuilding.name);
            } else {
                // Nếu không có, fetch từ API
                dispatch(fetchBuildingById(buildingId))
                    .unwrap()
                    .then((building) => {
                        reset({ name: building.name, address: building.address });
                        setImagePreview(building.imageUrl || null);
                        setDynamicSegment(building.name);
                    })
                    .catch(() => navigate('/buildings'));
            }
        } else {
            setDynamicSegment("Tạo tòa nhà mới");
        }
        return () => { dispatch(resetStatus()) };
    }, [id, isEditMode, dispatch, reset, navigate, buildings, setDynamicSegment]);

    const onSubmit = (data: FormValues) => {
        const image = data.image?.[0];

        if (isEditMode) {
            dispatch(updateBuilding({ id: Number(id), name: data.name, address: data.address, image }))
                .unwrap()
                .then(() => {
                    toast.success('Cập nhật tòa nhà thành công!');
                    navigate('/buildings');
                })
                .catch((error) => toast.error(error));
        } else {
            dispatch(createBuilding({ name: data.name, address: data.address, image }))
                .unwrap()
                .then(() => {
                    toast.success('Thêm tòa nhà thành công!');
                    navigate('/buildings');
                })
                .catch((error) => toast.error(error));
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="secondary" size="sm" onClick={() => navigate(-1)}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <h1 className="text-2xl font-bold tracking-tight">
                    {isEditMode ? 'Chỉnh sửa Tòa nhà' : 'Thêm Tòa nhà mới'}
                </h1>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Thông tin cơ bản</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="space-y-2">
                            <label htmlFor="name">Tên tòa nhà</label>
                            <Input id="name" {...register('name')} error={!!errors.name} />
                            {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="address">Địa chỉ</label>
                            <Input id="address" {...register('address')} error={!!errors.address} />
                            {errors.address && <p className="text-sm text-red-500">{errors.address.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="image">Ảnh đại diện</label>
                            {imagePreview && (
                                <img src={imagePreview} alt="Preview" className="h-32 w-32 rounded-md object-cover" />
                            )}
                            <Input id="image" type="file" accept="image/*" {...register('image')} />
                        </div>

                        <div className="flex justify-end gap-2">
                            <Button type="button" variant="secondary" onClick={() => navigate('/buildings')}>Hủy</Button>
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

export default BuildingFormPage;