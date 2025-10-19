import { useCallback, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { useBreadcrumb } from '@/context/BreadcrumbContext';
import { fetchMeterReadingsByRoom, selectAllMeterReadings, selectMeterReadingsStatus, MeterReading, clearReadings } from '@/store/meterReadings';
import { fetchRoomById, selectRoomById } from '@/store/rooms';
import { Column, DataTable } from '@/components/shared/DataTable';
import { Button } from '@/components/shared/Button';
import { ArrowLeft, CheckCircle, FilePlus, Image as ImageIcon } from 'lucide-react';
import { selectAllContracts } from '@/store/contracts';
import { generateInvoice, selectInvoicesStatus } from '@/store/invoices';
import { selectAllSettings } from '@/store/settings';
import { toast } from 'react-toastify';

const MeterReadingHistoryPage = () => {
    const { roomId } = useParams<{ roomId: string }>();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { setDynamicSegment } = useBreadcrumb();

    const numericRoomId = Number(roomId);

    const readings = useAppSelector(selectAllMeterReadings);
    const status = useAppSelector(selectMeterReadingsStatus);
    const room = useAppSelector(selectRoomById(numericRoomId));
    const contracts = useAppSelector(selectAllContracts);
    const settings = useAppSelector(selectAllSettings);
    const invoiceStatus = useAppSelector(selectInvoicesStatus);

    const [generatingInvoiceId, setGeneratingInvoiceId] = useState<number | null>(null);


    useEffect(() => {
        if (numericRoomId) {
            if (!room) {
                dispatch(fetchRoomById(numericRoomId));
            }
            dispatch(fetchMeterReadingsByRoom(numericRoomId));
        }
        return () => {
            dispatch(clearReadings());
            setDynamicSegment(null);
        }
    }, [numericRoomId, dispatch, room, setDynamicSegment]);

    useEffect(() => {
        if (room) {
            setDynamicSegment(`Lịch sử phòng ${room.roomNumber}`);
        }
    }, [room, setDynamicSegment]);

    // Hàm xử lý khi click nút "Tạo hóa đơn"
    const handleGenerateInvoice = useCallback(async (reading: MeterReading) => {
        setGeneratingInvoiceId(reading.id);

        // Tìm hợp đồng đang active của phòng này
        const activeContract = contracts.find(c => c.roomId === reading.roomId && c.status === 'ACTIVE');
        if (!activeContract) {
            toast.error(`Không tìm thấy hợp đồng đang hoạt động cho phòng ${room?.roomNumber}.`);
            setGeneratingInvoiceId(null);
            return;
        }

        // Lấy đơn giá điện nước từ settings
        const electricityPrice = Number(settings.find(s => s.key === 'PRICE_ELECTRICITY')?.value || '0');
        const waterPrice = Number(settings.find(s => s.key === 'PRICE_WATER')?.value || '0');
        if (electricityPrice === 0 || waterPrice === 0) {
            toast.error('Vui lòng cấu hình đơn giá điện/nước trong trang Cài đặt.');
            setGeneratingInvoiceId(null);
            return;
        }

        // Dispatch action
        try {
            await dispatch(generateInvoice({
                contractId: activeContract.id,
                periodMonth: reading.readingMonth,
                periodYear: reading.readingYear,
                electricityPrice,
                waterPrice,
            })).unwrap();

            toast.success('Tạo hóa đơn thành công!');
            // Fetch lại danh sách chỉ số để cập nhật trạng thái
            dispatch(fetchMeterReadingsByRoom(numericRoomId));
        } catch (error) {
            toast.error(error as string);
        } finally {
            setGeneratingInvoiceId(null);
        }
    }, [contracts, settings, dispatch, room?.roomNumber, numericRoomId]);

    const columns: Column<MeterReading>[] = [
        {
            header: 'Kỳ Ghi',
            accessor: 'readingMonth',
            render: (reading) => <span className="font-medium">{`Tháng ${reading.readingMonth}/${reading.readingYear}`}</span>
        },
        { header: 'Chỉ số điện (cũ-mới)', accessor: 'oldElectricNumber', render: (r) => `${r.oldElectricNumber} - ${r.newElectricNumber}` },
        { header: 'Tiêu thụ (kWh)', accessor: 'electricConsumption', render: (r) => <span className="font-bold text-blue-600">{r.electricConsumption}</span> },
        { header: 'Chỉ số nước (cũ-mới)', accessor: 'oldWaterNumber', render: (r) => `${r.oldWaterNumber} - ${r.newWaterNumber}` },
        { header: 'Tiêu thụ (m³)', accessor: 'waterConsumption', render: (r) => <span className="font-bold text-blue-600">{r.waterConsumption}</span> },
        {
            header: 'Ảnh',
            accessor: 'id',
            render: (reading) => (
                <div className="flex gap-2">
                    {reading.electricImageUrl && <a href={reading.electricImageUrl} target="_blank" rel="noopener noreferrer" title="Xem ảnh điện"><ImageIcon className="h-5 w-5 text-gray-500 hover:text-blue-600" /></a>}
                    {reading.waterImageUrl && <a href={reading.waterImageUrl} target="_blank" rel="noopener noreferrer" title="Xem ảnh nước"><ImageIcon className="h-5 w-5 text-gray-500 hover:text-green-600" /></a>}
                </div>
            )
        },
        {
            header: 'Trạng thái Hóa đơn',
            accessor: 'invoiceGenerated',
            render: (reading) => (
                reading.invoiceGenerated ? (
                    <span className="flex items-center text-sm text-green-600 font-semibold">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Đã tạo hóa đơn
                    </span>
                ) : (
                    <Button
                        size="sm"
                        onClick={() => handleGenerateInvoice(reading)}
                        isLoading={generatingInvoiceId === reading.id}
                        disabled={generatingInvoiceId !== null}
                    >
                        <FilePlus className="h-4 w-4 mr-1" />
                        Tạo Hóa đơn
                    </Button>
                )
            )
        },
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="secondary" size="sm" onClick={() => navigate(-1)}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">
                        Lịch sử ghi điện nước - Phòng {room?.roomNumber || '...'}
                    </h1>
                    <p className="text-muted-foreground">Tra cứu và quản lý hóa đơn cho từng kỳ ghi chỉ số.</p>
                </div>
            </div>

            <DataTable
                columns={columns}
                data={readings}
                isLoading={status === 'loading'}
            />
        </div>
    );
};

export default MeterReadingHistoryPage;