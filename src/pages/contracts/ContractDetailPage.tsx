import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { useBreadcrumb } from '@/context/BreadcrumbContext';

import {
    fetchContractById,
    selectContractById,
    selectContractsStatus,
    terminateContract,
    sendForSigning,
    approveSignature,
    requestTermination,
    ContractStatus,
} from '@/store/contracts';

import { Spinner } from '@/components/shared/Spinner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/shared/Card';
import { Button } from '@/components/shared/Button';
import toast from '@/lib/toast';
import { ArrowLeft, Edit, FileDown, Paperclip, Send, AlertTriangle, CheckCircle, Clock, FileX, ShieldCheck, UserCheck } from 'lucide-react';
import { ConfirmModal } from '@/components/shared/ConfirmModal';

const StatusBadge = ({ status }: { status: ContractStatus }) => {
    const statusMap: Record<ContractStatus, { text: string; icon: any; color: string }> = {
        [ContractStatus.DRAFT]: { text: 'Bản nháp', icon: Edit, color: 'bg-gray-100 text-gray-800' },
        [ContractStatus.WAITING_SIGNATURES]: { text: 'Chờ ký', icon: Clock, color: 'bg-blue-100 text-blue-800' },
        [ContractStatus.ACTIVE]: { text: 'Đang hiệu lực', icon: CheckCircle, color: 'bg-green-100 text-green-800' },
        [ContractStatus.PENDING_TERMINATION]: { text: 'Chờ chấm dứt', icon: AlertTriangle, color: 'bg-yellow-100 text-yellow-800' },
        [ContractStatus.TERMINATED]: { text: 'Đã chấm dứt', icon: FileX, color: 'bg-red-100 text-red-800' },
        [ContractStatus.EXPIRED]: { text: 'Đã hết hạn', icon: Clock, color: 'bg-gray-100 text-gray-500' },
    };
    const { text, icon: Icon, color } = statusMap[status] || { text: 'Không rõ', icon: AlertTriangle, color: 'bg-gray-100' };
    return <span className={`flex items-center px-3 py-1 text-xs font-medium rounded-full ${color}`}><Icon className="h-4 w-4 mr-1.5" />{text}</span>;
}

const InfoRow = ({ label, value }: { label: string, value: any }) => (
    <div className="flex flex-col sm:flex-row justify-between border-b py-3 text-sm sm:items-center">
        <span className="text-gray-500">{label}</span>
        <span className="font-semibold text-gray-800 text-left sm:text-right">{value}</span>
    </div>
);

const ContractDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { setDynamicSegment } = useBreadcrumb();

    const contractId = Number(id);
    const contract = useAppSelector(selectContractById(contractId));
    const status = useAppSelector(selectContractsStatus);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [modalAction, setModalAction] = useState<'terminate' | 'request-termination' | null>(null);

    useEffect(() => {
        if (!contract) {
            dispatch(fetchContractById(contractId));
        }
        return () => setDynamicSegment(null);
    }, [contractId, contract, dispatch, setDynamicSegment]);

    useEffect(() => {
        if (contract) {
            setDynamicSegment(`HĐ #${contract.id} - ${contract.roomNumber}`);
        }
    }, [contract, setDynamicSegment]);

    const handleAction = useCallback(async (action: Function, successMessage: string) => {
        setIsSubmitting(true);
        try {
            await dispatch(action(contractId)).unwrap();
            toast.success(successMessage);
        } catch (error) {
            toast.error(error as string);
        } finally {
            setIsSubmitting(false);
            setModalAction(null);
        }
    }, [dispatch, contractId]);

    if (!contract && (status === 'loading' || status === 'idle')) {
        return <div className="flex h-full items-center justify-center"><Spinner size="lg" /></div>;
    }
    if (!contract) {
        return <p className="text-center p-8">Không tìm thấy hợp đồng.</p>;
    }

    const renderActions = () => {
        switch (contract.status) {
            case ContractStatus.DRAFT:
                return (
                    <>
                        <Button variant="secondary" onClick={() => navigate(`/contracts/edit/${contract.id}`)} disabled={isSubmitting}><Edit className="mr-2 h-4 w-4" /> Sửa thông tin</Button>
                        <Button onClick={() => handleAction(sendForSigning, 'Đã gửi hợp đồng đi để ký!')} isLoading={isSubmitting}><Send className="mr-2 h-4 w-4" /> Gửi đi để ký</Button>
                    </>
                );
            case ContractStatus.WAITING_SIGNATURES:
                return (
                    <>
                        <a href={`${import.meta.env.VITE_API_BASE_URL}/contracts/${contract.id}/download-pdf`}><Button variant="secondary" disabled={isSubmitting}><FileDown className="mr-2 h-4 w-4" /> Tải bản PDF</Button></a>
                        <Button variant="secondary" disabled={isSubmitting}>
                            <label htmlFor="upload-signed-file" className="cursor-pointer flex items-center justify-center"><Paperclip className="mr-2 h-4 w-4" /> Tải bản đã ký</label>
                        </Button>
                        {/* <input id="upload-signed-file" type="file" className="hidden"/> */}

                        {contract.tenantSignatureUrl ?
                            <Button onClick={() => handleAction(approveSignature, 'Đã duyệt chữ ký và kích hoạt hợp đồng!')} isLoading={isSubmitting}>
                                <ShieldCheck className="mr-2 h-4 w-4" /> Duyệt chữ ký
                            </Button>
                            : <Button disabled>Chờ khách thuê ký số</Button>
                        }
                    </>
                );
            case ContractStatus.ACTIVE:
                return (
                    <Button variant="danger" onClick={() => setModalAction('request-termination')} isLoading={isSubmitting}>
                        <AlertTriangle className="mr-2 h-4 w-4" /> Yêu cầu Chấm dứt
                    </Button>
                );
            case ContractStatus.PENDING_TERMINATION:
                return (
                    <Button variant="danger" onClick={() => setModalAction('terminate')} isLoading={isSubmitting}>
                        <FileX className="mr-2 h-4 w-4" /> Xác nhận Chấm dứt Hợp đồng
                    </Button>
                );
            default:
                return <p className="text-sm text-gray-500">Không có hành động nào cho trạng thái này.</p>;
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <Button variant="secondary" size="sm" onClick={() => navigate(-1)} className="h-9 w-9 p-0"><ArrowLeft className="h-5 w-5" /></Button>
                    <div>
                        <h1 className="text-2xl font-bold">Chi tiết Hợp đồng #{contract.id}</h1>
                    </div>
                </div>
                <StatusBadge status={contract.status} />
            </div>

            <Card>
                <CardHeader><CardTitle>Hành động</CardTitle></CardHeader>
                <CardContent className="flex flex-wrap items-center justify-end gap-2">
                    {renderActions()}
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader><CardTitle>Nội dung hợp đồng</CardTitle></CardHeader>
                    <CardContent>
                        <InfoRow label="Bên cho thuê" value="NestMatrix Platform (Admin)" />
                        <InfoRow label="Bên thuê" value={contract.tenantName} />
                        <InfoRow label="Phòng" value={contract.roomNumber} />
                        <InfoRow label="Ngày bắt đầu" value={contract.startDate} />
                        <InfoRow label="Ngày kết thúc" value={contract.endDate} />
                        <InfoRow label="Tiền thuê" value={`${contract.rentAmount.toLocaleString('vi-VN')} VND/tháng`} />
                        <InfoRow label="Tiền cọc" value={`${contract.depositAmount.toLocaleString('vi-VN')} VND`} />
                        <InfoRow label="Chu kỳ thanh toán" value={`${contract.paymentCycle} tháng/lần`} />
                    </CardContent>
                </Card>
                <div className="space-y-6">
                    <Card>
                        <CardHeader><CardTitle>Chữ ký số</CardTitle></CardHeader>
                        <CardContent>
                            {contract.tenantSignatureUrl ? (
                                <div>
                                    <h4 className="font-semibold text-sm mb-2">Chữ ký của khách thuê ({new Date(contract.tenantSignedAt!).toLocaleString('vi-VN')}):</h4>
                                    <img src={contract.tenantSignatureUrl} alt="Chữ ký" className="border rounded-md h-32 w-auto bg-gray-50 p-2" />
                                </div>
                            ) : (
                                <div className="text-center text-gray-500 py-4">
                                    <UserCheck className="mx-auto h-8 w-8 text-gray-400" />
                                    <p className="mt-2 text-sm">Chưa có chữ ký từ khách thuê.</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>

            <ConfirmModal
                isOpen={modalAction === 'request-termination'}
                onClose={() => setModalAction(null)}
                onConfirm={() => handleAction(requestTermination, 'Đã gửi yêu cầu chấm dứt hợp đồng.')}
                title="Yêu cầu Chấm dứt Hợp đồng?"
                description="Hệ thống sẽ gửi thông báo yêu cầu chấm dứt đến cho khách thuê. Bạn có chắc chắn không?"
                isLoading={isSubmitting}
            />
            <ConfirmModal
                isOpen={modalAction === 'terminate'}
                onClose={() => setModalAction(null)}
                onConfirm={() => handleAction(terminateContract, 'Đã chấm dứt hợp đồng thành công.')}
                title="Xác nhận Chấm dứt Hợp đồng?"
                description="Hành động này sẽ chính thức chấm dứt hợp đồng. Phòng sẽ được chuyển về trạng thái TRỐNG."
                confirmText='Xác nhận'
                isLoading={isSubmitting}
            />
        </div>
    );
};

export default ContractDetailPage;