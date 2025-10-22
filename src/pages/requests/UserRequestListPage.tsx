import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchPendingRequests, approveRequest, rejectRequest, selectAllUserRequests, selectUserRequestsStatus } from '@/store/userRequests';
import { Column, DataTable } from '@/components/shared/DataTable';
import { Button } from '@/components/shared/Button';
import { Check, X } from 'lucide-react';
import toast from '@/lib/toast';

const UserRequestListPage = () => {
    const dispatch = useAppDispatch();
    const requests = useAppSelector(selectAllUserRequests);
    const status = useAppSelector(selectUserRequestsStatus);

    useEffect(() => {
        dispatch(fetchPendingRequests());
    }, [dispatch]);

    const handleApprove = (requestId: number) => {
        dispatch(approveRequest(requestId)).unwrap()
            .then(() => toast.success("Đã phê duyệt yêu cầu."))
            .catch((err) => toast.error(err as string));
    };

    const handleReject = (requestId: number) => {
        dispatch(rejectRequest(requestId)).unwrap()
            .then(() => toast.warn("Đã từ chối yêu cầu."))
            .catch((err) => toast.error(err as string));
    };

    const columns: Column<any>[] = [
        { header: 'Thời gian', accessor: 'createdAt', render: (req) => new Date(req.createdAt).toLocaleString('vi-VN') },
        { header: 'Nội dung yêu cầu', accessor: 'message' },
        { header: 'Người gửi', accessor: 'userName' },
        {
            header: 'Hành động', accessor: 'actions', render: (req) => (
                <div className="flex gap-2">
                    <Button size="sm" onClick={() => handleApprove(req.id)} disabled={status === 'loading'}>
                        <Check className="h-4 w-4" /> Phê duyệt
                    </Button>
                    <Button size="sm" variant="danger" onClick={() => handleReject(req.id)} disabled={status === 'loading'}>
                        <X className="h-4 w-4" /> Từ chối
                    </Button>
                </div>
            )
        }
    ];

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">Yêu cầu từ người dùng</h1>
            <p className="text-muted-foreground">Duyệt các yêu cầu gia hạn, thanh lý, thay đổi hợp đồng...</p>

            <DataTable
                columns={columns}
                data={requests}
                isLoading={status === 'loading'}
            />
        </div>
    );
};

export default UserRequestListPage;