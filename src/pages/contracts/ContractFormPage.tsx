import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { useBreadcrumb } from '@/context/BreadcrumbContext';
import { createContract, selectContractsStatus, resetStatus as resetContractStatus } from '@/store/contracts';
import { fetchRooms, selectAllRooms, clearRooms, RoomStatus } from '@/store/rooms';
import { fetchTenants, selectAllTenants, selectTenantsStatus } from '@/store/tenants';
import { fetchBuildings, selectAllBuildings, selectBuildingsStatus } from '@/store/buildings';
import toast from '@/lib/toast';
import { Button } from '@/components/shared/Button';
import { Input } from '@/components/shared/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/shared/Card';
import { Select, SelectOption } from '@/components/shared/Select';
import { ArrowLeft } from 'lucide-react';
import { useMemo } from 'react';

const formSchema = z.object({
    buildingId: z.string().min(1, 'Vui lòng chọn tòa nhà.'),
    roomId: z.string().min(1, 'Vui lòng chọn phòng.'),
    tenantId: z.string().min(1, 'Vui lòng chọn khách thuê.'),
    startDate: z.string().min(1, 'Ngày bắt đầu là bắt buộc.'),
    endDate: z.string().min(1, 'Ngày kết thúc là bắt buộc.'),
    rentAmount: z.preprocess((val) => Number(String(val).replace(/,/g, '')), z.number().min(1, 'Tiền thuê phải lớn hơn 0.')),
    depositAmount: z.preprocess((val) => Number(String(val).replace(/,/g, '')), z.number().min(0, 'Tiền cọc không được âm.')),
    paymentCycle: z.preprocess((val) => Number(val), z.number().min(1, 'Chu kỳ thanh toán phải ít nhất 1 tháng.')),
}).refine(data => {
    if (data.startDate && data.endDate) return new Date(data.startDate) < new Date(data.endDate);
    return true;
}, { message: "Ngày kết thúc phải sau ngày bắt đầu.", path: ["endDate"] });

type FormValues = z.infer<typeof formSchema>;

const ContractFormPage = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { setDynamicSegment } = useBreadcrumb();

    const contractStatus = useAppSelector(selectContractsStatus);
    const rooms = useAppSelector(selectAllRooms);
    const tenants = useAppSelector(selectAllTenants);
    const buildings = useAppSelector(selectAllBuildings);
    const buildingStatus = useAppSelector(selectBuildingsStatus);
    const tenantStatus = useAppSelector(selectTenantsStatus);

    const isLoading = contractStatus === 'loading';

    const { register, handleSubmit, watch, formState: { errors } } = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            buildingId: "",
            roomId: "",
            tenantId: "",
            paymentCycle: 1,
        }
    });

    const watchedBuildingId = watch('buildingId');

    useEffect(() => {
        setDynamicSegment("Tạo hợp đồng mới");
        if (buildingStatus === 'idle') dispatch(fetchBuildings({ page: 0, size: 100 }));
        if (tenantStatus === 'idle') dispatch(fetchTenants({ page: 0, size: 100 }));
        return () => { setDynamicSegment(null); dispatch(resetContractStatus()); };
    }, [dispatch, setDynamicSegment, buildingStatus, tenantStatus]);

    useEffect(() => {
        if (watchedBuildingId && Number(watchedBuildingId) > 0) {
            dispatch(fetchRooms({ page: 0, size: 100, buildingId: Number(watchedBuildingId) }));
        } else {
            dispatch(clearRooms());
        }
    }, [watchedBuildingId, dispatch]);

    const onSubmit = (data: FormValues) => {
        // SỬA LỖI 3: Chuyển đổi kiểu dữ liệu trước khi dispatch
        const payload = {
            roomId: Number(data.roomId),
            tenantId: Number(data.tenantId),
            startDate: data.startDate,
            endDate: data.endDate,
            rentAmount: data.rentAmount,
            depositAmount: data.depositAmount,
            paymentCycle: data.paymentCycle,
        };
        dispatch(createContract(payload)).unwrap().then(() => {
            toast.success('Tạo hợp đồng thành công!');
            navigate('/contracts');
        }).catch((error) => toast.error(error as string));
    };

    const availableRooms = useMemo(() => {
        if (!watchedBuildingId) return [];
        return rooms.filter(room => room.status === RoomStatus.AVAILABLE);
    }, [rooms, watchedBuildingId]);

    const buildingOptions: SelectOption[] = useMemo(() => buildings.map(b => ({ value: b.id, label: b.name })), [buildings]);
    const tenantOptions: SelectOption[] = useMemo(() => tenants.map(t => ({ value: t.id, label: `${t.fullName} - ${t.citizenId}` })), [tenants]);
    const availableRoomOptions: SelectOption[] = useMemo(() => availableRooms.map(r => ({ value: r.id, label: r.roomNumber })), [availableRooms]);

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="secondary" size="sm" onClick={() => navigate(-1)}><ArrowLeft className="h-4 w-4" /></Button>
                <h1 className="text-2xl font-bold">Tạo hợp đồng mới</h1>
            </div>

            <Card>
                <CardHeader><CardTitle>Thông tin hợp đồng</CardTitle></CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label htmlFor="buildingId" className="font-medium">Tòa nhà</label>
                                <Select id="buildingId" options={buildingOptions} placeholder="-- Chọn tòa nhà trước --" {...register('buildingId')} error={!!errors.buildingId} />
                                {errors.buildingId && <p className="text-sm text-red-500 mt-1">{errors.buildingId.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="roomId" className="font-medium">Phòng cho thuê (Chỉ hiện phòng trống)</label>
                                <Select id="roomId" options={availableRoomOptions} placeholder="-- Chọn phòng --" {...register('roomId')} error={!!errors.roomId} disabled={!watchedBuildingId || availableRoomOptions.length === 0} />
                                {errors.roomId && <p className="text-sm text-red-500 mt-1">{errors.roomId.message}</p>}
                            </div>

                            <div className="space-y-2 md:col-span-2">
                                <label htmlFor="tenantId" className="font-medium">Khách thuê</label>
                                <Select id="tenantId" options={tenantOptions} placeholder="-- Chọn khách thuê --" {...register('tenantId')} error={!!errors.tenantId} />
                                {errors.tenantId && <p className="text-sm text-red-500 mt-1">{errors.tenantId.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="startDate" className="font-medium">Ngày bắt đầu</label>
                                <Input id="startDate" type="date" {...register('startDate')} error={!!errors.startDate} />
                                {errors.startDate && <p className="text-sm text-red-500 mt-1">{errors.startDate.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="endDate" className="font-medium">Ngày kết thúc</label>
                                <Input id="endDate" type="date" {...register('endDate')} error={!!errors.endDate} />
                                {errors.endDate && <p className="text-sm text-red-500 mt-1">{errors.endDate.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="rentAmount" className="font-medium">Tiền thuê (VND/tháng)</label>
                                <Input id="rentAmount" type="number" {...register('rentAmount')} error={!!errors.rentAmount} />
                                {errors.rentAmount && <p className="text-sm text-red-500 mt-1">{errors.rentAmount.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="depositAmount" className="font-medium">Tiền cọc (VND)</label>
                                <Input id="depositAmount" type="number" {...register('depositAmount')} error={!!errors.depositAmount} />
                                {errors.depositAmount && <p className="text-sm text-red-500 mt-1">{errors.depositAmount.message}</p>}
                            </div>
                        </div>
                        <div className="flex justify-end gap-2 pt-4">
                            <Button type="button" variant="secondary" onClick={() => navigate('/contracts')}>Hủy</Button>
                            <Button type="submit" isLoading={isLoading}>Tạo hợp đồng</Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default ContractFormPage;