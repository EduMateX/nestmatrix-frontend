// src/pages/contracts/ContractDetailPage.tsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { useBreadcrumb } from '@/context/BreadcrumbContext';
import { fetchContractById, selectContractById, selectContractsStatus, uploadContractFile } from '@/store/contracts';
import { Spinner } from '@/components/shared/Spinner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/shared/Card';
import { Button } from '@/components/shared/Button';
import { Input } from '@/components/shared/Input';
import { ArrowLeft, Download, Upload } from 'lucide-react';
import toast from '@/lib/toast';

const ContractDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { setDynamicSegment } = useBreadcrumb();

    const contractId = Number(id);
    const contract = useAppSelector(selectContractById(contractId));
    const status = useAppSelector(selectContractsStatus);

    const [isUploading, setIsUploading] = useState(false);

    useEffect(() => {
        if (!contract) {
            dispatch(fetchContractById(contractId));
        }
        // Cleanup
        return () => setDynamicSegment(null);
    }, [contractId, dispatch, contract, setDynamicSegment]);

    // Cập nhật breadcrumb khi có dữ liệu
    useEffect(() => {
        if (contract) {
            setDynamicSegment(`HĐ ${contract.roomNumber} - ${contract.tenantName}`);
        }
    }, [contract, setDynamicSegment]);

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setIsUploading(true);
            dispatch(uploadContractFile({ id: contractId, file }))
                .unwrap()
                .then(() => toast.success('Tải file hợp đồng thành công!'))
                .catch((error) => toast.error(error as string))
                .finally(() => setIsUploading(false));
        }
    };

    if (status === 'loading' && !contract) {
        return <div className="flex h-64 items-center justify-center"><Spinner size="lg" /></div>;
    }

    if (!contract) {
        return <div className="text-center">Không tìm thấy hợp đồng.</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="secondary" size="sm" onClick={() => navigate(-1)}><ArrowLeft className="h-4 w-4" /></Button>
                <div>
                    <h1 className="text-2xl font-bold">Chi tiết Hợp đồng</h1>
                    <p className="text-muted-foreground">Hợp đồng cho phòng {contract.roomNumber}</p>
                </div>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
                {/* Cột thông tin chính */}
                <div className="md:col-span-2 space-y-6">
                    <Card>
                        <CardHeader><CardTitle>Thông tin chính</CardTitle></CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div><strong>Khách thuê:</strong> {contract.tenantName}</div>
                                <div><strong>Số phòng:</strong> {contract.roomNumber}</div>
                                <div><strong>Ngày bắt đầu:</strong> {contract.startDate}</div>
                                <div><strong>Ngày kết thúc:</strong> {contract.endDate}</div>
                                <div><strong>Tiền thuê:</strong> {contract.rentAmount.toLocaleString('vi-VN')} VND</div>
                                <div><strong>Tiền cọc:</strong> {contract.depositAmount.toLocaleString('vi-VN')} VND</div>
                                <div><strong>Chu kỳ TT:</strong> {contract.paymentCycle} tháng</div>
                                <div><strong>Trạng thái:</strong> {contract.status}</div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Cột file hợp đồng */}
                <div>
                    <Card>
                        <CardHeader><CardTitle>File Hợp đồng</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            {contract.contractFileUrl ? (
                                <div>
                                    <p className="text-sm mb-4">File hợp đồng đã được tải lên.</p>
                                    <a href={contract.contractFileUrl} target="_blank" rel="noopener noreferrer">
                                        <Button className="w-full">
                                            <Download className="mr-2 h-4 w-4" />
                                            Xem/Tải file PDF
                                        </Button>
                                    </a>
                                </div>
                            ) : (
                                <p className="text-sm text-gray-500">Chưa có file hợp đồng nào được tải lên.</p>
                            )}

                            <div className="relative">
                                <Button className="w-full" variant="secondary" isLoading={isUploading}>
                                    <label htmlFor="contract-file">
                                        <Upload className="mr-2 h-4 w-4" />
                                        {contract.contractFileUrl ? 'Tải lên file mới' : 'Tải lên file PDF'}
                                    </label>
                                </Button>
                                <Input id="contract-file" type="file" className="absolute inset-0 opacity-0 w-full h-full cursor-pointer" accept=".pdf" onChange={handleFileUpload} disabled={isUploading} />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default ContractDetailPage;