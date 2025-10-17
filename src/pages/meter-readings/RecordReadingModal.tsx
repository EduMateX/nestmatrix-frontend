// src/pages/meter-readings/RecordReadingModal.tsx
import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/shared/Button';
import { Input } from '@/components/shared/Input';
import { Room } from '@/store/rooms';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { recordMeterReading, selectMeterReadingsStatus } from '@/store/meterReadings';
import toast from '@/lib/toast';
import { X } from 'lucide-react';

interface RecordReadingModalProps {
    isOpen: boolean;
    onClose: () => void;
    room: Room | null;
}

// Zod schema for validation
const formSchema = z.object({
    newElectricNumber: z.preprocess(val => Number(val), z.number().min(0, "Chỉ số không được âm")),
    newWaterNumber: z.preprocess(val => Number(val), z.number().min(0, "Chỉ số không được âm")),
    electricImage: z.instanceof(FileList).optional(),
    waterImage: z.instanceof(FileList).optional(),
});
type FormValues = z.infer<typeof formSchema>;

export const RecordReadingModal = ({ isOpen, onClose, room }: RecordReadingModalProps) => {
    const dispatch = useAppDispatch();
    const status = useAppSelector(selectMeterReadingsStatus);
    const isLoading = status === 'loading';

    const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({
        resolver: zodResolver(formSchema),
    });

    useEffect(() => {
        // Reset form khi modal mở hoặc khi chọn phòng khác
        if (isOpen) {
            reset({ newElectricNumber: 0, newWaterNumber: 0, electricImage: undefined, waterImage: undefined });
        }
    }, [isOpen, reset]);

    const onSubmit = (data: FormValues) => {
        if (!room) return;

        const currentMonth = new Date().getMonth() + 1;
        const currentYear = new Date().getFullYear();

        dispatch(recordMeterReading({
            roomId: room.id,
            readingMonth: currentMonth,
            readingYear: currentYear,
            ...data,
            electricImage: data.electricImage?.[0],
            waterImage: data.waterImage?.[0],
        })).unwrap()
            .then(() => {
                toast.success(`Ghi chỉ số cho phòng ${room.roomNumber} thành công!`);
                onClose();
            })
            .catch((error) => toast.error(error as string));
    };

    if (!room) return null;

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                    <div className="fixed inset-0 bg-black/30" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4">
                        <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
                            <Dialog.Panel className="w-full max-w-lg transform rounded-2xl bg-white p-6 shadow-xl transition-all">
                                <Dialog.Title as="h3" className="text-xl font-bold leading-6 text-gray-900">
                                    Ghi chỉ số Điện/Nước - Phòng {room.roomNumber}
                                </Dialog.Title>
                                <p className="text-sm text-gray-500 mt-1">Kỳ ghi: Tháng {new Date().getMonth() + 1}/{new Date().getFullYear()}</p>

                                <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label htmlFor="newElectricNumber" className="font-medium">Chỉ số điện mới</label>
                                            <Input id="newElectricNumber" type="number" {...register('newElectricNumber')} error={!!errors.newElectricNumber} disabled={isLoading} />
                                            {errors.newElectricNumber && <p className="text-xs text-red-500 mt-1">{errors.newElectricNumber.message}</p>}
                                        </div>
                                        <div className="space-y-2">
                                            <label htmlFor="newWaterNumber" className="font-medium">Chỉ số nước mới</label>
                                            <Input id="newWaterNumber" type="number" {...register('newWaterNumber')} error={!!errors.newWaterNumber} disabled={isLoading} />
                                            {errors.newWaterNumber && <p className="text-xs text-red-500 mt-1">{errors.newWaterNumber.message}</p>}
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label htmlFor="electricImage" className="font-medium">Ảnh công tơ điện (tùy chọn)</label>
                                            <Input id="electricImage" type="file" accept="image/*" {...register('electricImage')} disabled={isLoading} />
                                        </div>
                                        <div className="space-y-2">
                                            <label htmlFor="waterImage" className="font-medium">Ảnh công tơ nước (tùy chọn)</label>
                                            <Input id="waterImage" type="file" accept="image/*" {...register('waterImage')} disabled={isLoading} />
                                        </div>
                                    </div>

                                    <div className="mt-8 flex justify-end gap-3">
                                        <Button type="button" variant="secondary" onClick={onClose} disabled={isLoading}>Hủy</Button>
                                        <Button type="submit" isLoading={isLoading}>Lưu chỉ số</Button>
                                    </div>
                                </form>

                                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 outline-none">
                                    <X className="h-6 w-6" />
                                </button>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
};