import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { useBreadcrumb } from '@/context/BreadcrumbContext';
import { fetchInvoiceById, selectInvoiceById, confirmInvoicePayment, selectInvoicesStatus, InvoiceStatus } from '@/store/invoices';
import { Spinner } from '@/components/shared/Spinner';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/shared/Card';
import { Button } from '@/components/shared/Button';
import { ArrowLeft, CheckCircle, Download } from 'lucide-react';
import toast from '@/lib/toast';

const InvoiceDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { setDynamicSegment } = useBreadcrumb();
    const invoiceId = Number(id);

    const invoice = useAppSelector(selectInvoiceById(invoiceId));
    const status = useAppSelector(selectInvoicesStatus);
    const [isConfirming, setIsConfirming] = useState(false);

    useEffect(() => {
        // Chỉ fetch nếu chưa có dữ liệu trong store
        if (!invoice) {
            dispatch(fetchInvoiceById(invoiceId));
        }
        return () => setDynamicSegment(null);
    }, [invoiceId, invoice, dispatch, setDynamicSegment]);

    useEffect(() => {
        if (invoice) {
            setDynamicSegment(`Hóa đơn #${invoice.id}`);
        }
    }, [invoice, setDynamicSegment]);

    const handleConfirmPayment = () => {
        setIsConfirming(true);
        dispatch(confirmInvoicePayment(invoiceId))
            .unwrap()
            .then(() => toast.success("Xác nhận thanh toán thành công!"))
            .catch((error) => toast.error(error as string))
            .finally(() => setIsConfirming(false));
    };

    if (!invoice && status === 'loading') {
        return (
            <div className="flex h-64 items-center justify-center">
                <Spinner size="lg" />
            </div>
        );
    }

    if (!invoice) {
        return <div className="text-center p-8">Không tìm thấy thông tin hóa đơn.</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Button variant="secondary" size="sm" onClick={() => navigate(-1)}><ArrowLeft className="h-4 w-4" /></Button>
                    <div>
                        <h1 className="text-2xl font-bold">Chi tiết Hóa đơn #{invoice.id}</h1>
                        <p className="text-muted-foreground">Kỳ thanh toán: {invoice.periodMonth}/{invoice.periodYear}</p>
                    </div>
                </div>
                <Button variant="secondary">
                    <Download className="mr-2 h-4 w-4" />
                    In hóa đơn
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                <div className="lg:col-span-2 space-y-6">
                    {/* Card Chi tiết các khoản */}
                    <Card>
                        <CardHeader><CardTitle>Chi tiết các khoản</CardTitle></CardHeader>
                        <CardContent>
                            <table className="w-full text-sm">
                                <thead className="border-b">
                                    <tr>
                                        <th className="text-left py-2 font-semibold">Mô tả</th>
                                        <th className="text-right py-2 font-semibold">Thành tiền (VND)</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {invoice.details.map(detail => (
                                        <tr key={detail.id}>
                                            <td className="py-3">{detail.description}</td>
                                            <td className="text-right py-3">{detail.amount.toLocaleString('vi-VN')}</td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot className="border-t-2 border-gray-300">
                                    <tr className="font-bold">
                                        <td className="text-right py-4">TỔNG CỘNG</td>
                                        <td className="text-right py-4 text-xl text-blue-600">{invoice.totalAmount.toLocaleString('vi-VN')}</td>
                                    </tr>
                                </tfoot>
                            </table>
                        </CardContent>
                    </Card>
                </div>
                <div className="space-y-6">
                    {/* Card Thông tin thanh toán */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Thông tin Thanh toán</CardTitle>
                            <CardDescription>Trạng thái: {invoice.status}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {invoice.status === InvoiceStatus.WAITING_CONFIRMATION && (
                                <div className="space-y-4">
                                    <p className="font-medium text-sm">Biên lai chuyển khoản của khách thuê:</p>
                                    <a href={invoice.paymentReceiptUrl} target="_blank" rel="noopener noreferrer" className="block border rounded-md overflow-hidden">
                                        <img src={invoice.paymentReceiptUrl} alt="Biên lai" className="max-h-96 w-full object-contain hover:scale-105 transition-transform duration-300" />
                                    </a>
                                </div>
                            )}
                            {invoice.status === InvoiceStatus.PAID && <p className="text-green-600 font-medium">Đã thanh toán vào ngày {invoice.paymentDate}.</p>}
                            {invoice.status === InvoiceStatus.PENDING && <p className="text-orange-600 font-medium">Đang chờ khách thuê thanh toán.</p>}
                            {invoice.status === InvoiceStatus.OVERDUE && <p className="text-red-600 font-medium">Đã quá hạn thanh toán.</p>}
                        </CardContent>
                        {invoice.status === InvoiceStatus.WAITING_CONFIRMATION && (
                            <CardFooter>
                                <Button className="w-full" onClick={handleConfirmPayment} isLoading={isConfirming}>
                                    <CheckCircle className="mr-2 h-4 w-4" />
                                    Xác nhận đã nhận được thanh toán
                                </Button>
                            </CardFooter>
                        )}
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default InvoiceDetailPage;