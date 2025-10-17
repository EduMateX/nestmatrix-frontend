// src/pages/tenants/TenantFormPage.tsx
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { useBreadcrumb } from '@/context/BreadcrumbContext';
import {
    createTenant,
    updateTenant,
    fetchTenantById,
    selectTenantsStatus,
    selectTenantById // Thêm selector này
} from '@/store/tenants';
import toast from '@/lib/toast';

import { Button } from '@/components/shared/Button';
import { Input } from '@/components/shared/Input';
import { Card, CardContent } from '@/components/shared/Card';
import { ArrowLeft } from 'lucide-react';

const phoneRegex = new RegExp(/^(0[3|5|7|8|9])+([0-9]{8})$/);

const formSchema = z.object({
    fullName: z.string().min(3, 'Họ tên phải có ít nhất 3 ký tự.'),
    phoneNumber: z.string().regex(phoneRegex, 'Số điện thoại không hợp lệ.'),
    email: z.string().email('Email không hợp lệ.').optional().or(z.literal('')),
    password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự.').optional().or(z.literal('')),
    citizenId: z.string().min(9, 'Số CCCD không hợp lệ.'),
    dateOfBirth: z.string().optional(),
    permanentAddress: z.string().optional(),
});
type FormValues = z.infer<typeof formSchema>;

const TenantFormPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { setDynamicSegment } = useBreadcrumb();

    const isEditMode = Boolean(id);
    const tenantId = isEditMode ? Number(id) : undefined;
    const tenant = useAppSelector(selectTenantById(tenantId || -1));
    const status = useAppSelector(selectTenantsStatus);
    const isLoading = status === 'loading';

    const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({
        resolver: zodResolver(formSchema),
    });

    useEffect(() => {
        if (isEditMode && tenantId) {
            if (tenant) {
                reset(tenant);
                setDynamicSegment(tenant.fullName);
            } else {
                dispatch(fetchTenantById(tenantId)).unwrap().then((data) => {
                    reset(data);
                    setDynamicSegment(data.fullName);
                }).catch(() => navigate('/tenants'));
            }
        } else {
            setDynamicSegment("Thêm khách thuê mới");
        }
        return () => setDynamicSegment(null);
    }, [id, isEditMode, tenant, dispatch, reset, setDynamicSegment, navigate]);


    const onSubmit = (data: FormValues) => {
        const action = isEditMode
            ? updateTenant({ ...data, id: tenantId! })
            : createTenant(data);

        dispatch(action).unwrap().then(() => {
            toast.success(isEditMode ? 'Cập nhật thành công!' : 'Thêm khách thuê thành công!');
            navigate('/tenants');
        }).catch((error) => toast.error(error));
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="secondary" size="sm" onClick={() => navigate(-1)}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <h1 className="text-2xl font-bold tracking-tight">
                    {isEditMode ? 'Chỉnh sửa Khách thuê' : 'Thêm Khách thuê mới'}
                </h1>
            </div>

            <Card>
                <CardContent className="pt-6">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label>Họ và tên</label>
                                <Input {...register('fullName')} error={!!errors.fullName} />
                                {errors.fullName && <p className="text-sm text-red-500">{errors.fullName.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <label>Số điện thoại</label>
                                <Input {...register('phoneNumber')} error={!!errors.phoneNumber} />
                                {errors.phoneNumber && <p className="text-sm text-red-500">{errors.phoneNumber.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <label>Email</label>
                                <Input type="email" {...register('email')} error={!!errors.email} />
                                {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <label>Số CCCD</label>
                                <Input {...register('citizenId')} error={!!errors.citizenId} />
                                {errors.citizenId && <p className="text-sm text-red-500">{errors.citizenId.message}</p>}
                            </div>
                            {!isEditMode && (
                                <div className="space-y-2">
                                    <label>Mật khẩu (để trống để tự sinh)</label>
                                    <Input type="password" {...register('password')} error={!!errors.password} />
                                    {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
                                </div>
                            )}
                        </div>
                        <div className="flex justify-end gap-2 pt-4">
                            <Button type="button" variant="secondary" onClick={() => navigate('/tenants')}>Hủy</Button>
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

export default TenantFormPage;