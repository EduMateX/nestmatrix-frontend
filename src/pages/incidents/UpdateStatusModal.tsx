// src/pages/incidents/UpdateStatusModal.tsx
import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/shared/Button';
import { Select, SelectOption } from '@/components/shared/Select';
import { Incident } from '@/store/incidents';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { updateIncidentStatus, selectIncidentsStatus } from '@/store/incidents';
import toast from '@/lib/toast';
import { IncidentStatus, IncidentPriority } from '@/store/incidents/types';

interface UpdateStatusModalProps {
    isOpen: boolean;
    onClose: () => void;
    incident: Incident | null;
}

type FormValues = {
    status: IncidentStatus;
    priority: IncidentPriority;
};

const statusOptions: SelectOption[] = Object.values(IncidentStatus).map(s => ({ value: s, label: s }));
const priorityOptions: SelectOption[] = Object.values(IncidentPriority).map(p => ({ value: p, label: p }));

export const UpdateStatusModal = ({ isOpen, onClose, incident }: UpdateStatusModalProps) => {
    const dispatch = useAppDispatch();
    const status = useAppSelector(selectIncidentsStatus);
    const isLoading = status === 'loading';

    const { register, handleSubmit, reset } = useForm<FormValues>();

    useEffect(() => {
        if (incident) {
            reset({ status: incident.status, priority: incident.priority });
        }
    }, [incident, reset]);

    const onSubmit = (data: FormValues) => {
        if (!incident) return;
        dispatch(updateIncidentStatus({ id: incident.id, ...data }))
            .unwrap()
            .then(() => {
                toast.success(`Cập nhật sự cố thành công!`);
                onClose();
            })
            .catch((error) => toast.error(error as string));
    };

    if (!incident) return null;

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                {/* ... Overlay ... */}
                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4">
                        <Dialog.Panel className="w-full max-w-md transform rounded-2xl bg-white p-6 shadow-xl">
                            <Dialog.Title as="h3" className="text-lg font-bold">Cập nhật sự cố</Dialog.Title>
                            <p className="text-sm text-gray-500 truncate">"{incident.title}"</p>

                            <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
                                <div className='space-y-2'>
                                    <label>Trạng thái</label>
                                    <Select options={statusOptions} {...register('status')} />
                                </div>
                                <div className='space-y-2'>
                                    <label>Độ ưu tiên</label>
                                    <Select options={priorityOptions} {...register('priority')} />
                                </div>
                                <div className="mt-6 flex justify-end gap-2">
                                    <Button type="button" variant="secondary" onClick={onClose}>Hủy</Button>
                                    <Button type="submit" isLoading={isLoading}>Lưu</Button>
                                </div>
                            </form>
                        </Dialog.Panel>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
};