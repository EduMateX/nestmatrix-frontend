import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchContracts, terminateContract, selectAllContracts, selectContractsStatus, Contract, ContractStatus, selectContractsPagination } from '@/store/contracts';
import { Column, DataTable } from '@/components/shared/DataTable';
import { Button } from '@/components/shared/Button';
import { ConfirmModal } from '@/components/shared/ConfirmModal';
import { FilePlus, MessageSquareQuote } from 'lucide-react';
import toast from '@/lib/toast';
import { fetchPendingRequests, selectAllUserRequests } from '@/store/userRequests';

const ContractListPage = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedContract, setSelectedContract] = useState<Contract | null>(null);

    // Redux State
    const contracts = useAppSelector(selectAllContracts);
    const status = useAppSelector(selectContractsStatus);
    const pagination = useAppSelector(selectContractsPagination);
    const pendingRequests = useAppSelector(selectAllUserRequests);

    const currentPage = Number(searchParams.get('page')) || 0;

    useEffect(() => {
        // Luôn fetch khi page thay đổi hoặc status là 'idle'
        dispatch(fetchContracts({ page: currentPage, size: 10 }));
    }, [currentPage, dispatch]);

    // Fetch pending requests để hiển thị số lượng trên badge
    useEffect(() => {
        dispatch(fetchPendingRequests());
    }, [dispatch]);


    const handlePageChange = useCallback((newPage: number) => {
        setSearchParams({ page: String(newPage) });
    }, [setSearchParams]);

    const handleOpenTerminateModal = useCallback((contract: Contract) => {
        setSelectedContract(contract);
        setIsModalOpen(true);
    }, []);
    const handleConfirmTerminate = useCallback(() => {
        if (selectedContract) {
            dispatch(terminateContract(selectedContract.id))
                .unwrap()
                .then(() => {
                    toast.success(`Đã chấm dứt hợp đồng cho phòng "${selectedContract.roomNumber}"`);
                    // Sau khi chấm dứt, fetch lại trang hiện tại để cập nhật
                    dispatch(fetchContracts({ page: currentPage, size: 10 }));
                })
                .catch((error) => toast.error(error as string))
                .finally(() => setIsModalOpen(false));
        }
    }, [selectedContract, dispatch, currentPage]);

    const getStatusBadge = (status: ContractStatus) => {
        const styles = {
            [ContractStatus.ACTIVE]: "bg-green-100 text-green-800",
            [ContractStatus.EXPIRED]: "bg-gray-100 text-gray-800",
            [ContractStatus.TERMINATED]: "bg-yellow-100 text-yellow-800",
        };
        return <span className={`text-xs font-medium me-2 px-2.5 py-0.5 rounded-full ${styles[status]}`}>{status}</span>;
    };

    const columns: Column<Contract>[] = [
        { header: 'Số phòng', accessor: 'roomNumber', render: (c) => <span className="font-medium">{c.roomNumber}</span> },
        { header: 'Khách thuê', accessor: 'tenantName' },
        { header: 'Ngày bắt đầu', accessor: 'startDate' },
        { header: 'Ngày kết thúc', accessor: 'endDate' },
        { header: 'Trạng thái', accessor: 'status', render: (c) => getStatusBadge(c.status) },
        {
            header: 'Actions',
            accessor: 'id',
            render: (contract) => (
                <div className="flex gap-2">
                    {/* Nút xem chi tiết/sửa */}
                    <Button variant="secondary" size="sm" onClick={() => navigate(`/contracts/${contract.id}`)}>
                        Xem chi tiết
                    </Button>
                    {contract.status === ContractStatus.ACTIVE && (
                        <Button variant="danger" size="sm" onClick={() => handleOpenTerminateModal(contract)}>
                            Chấm dứt
                        </Button>
                    )}
                </div>
            ),
        },
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Quản lý Hợp đồng</h1>
                    <p className="text-muted-foreground">Tổng số {pagination.totalElements} hợp đồng.</p>
                </div>
                <div className="flex items-center gap-2">
                    {/* Nút điều hướng đến trang Yêu cầu */}
                    <Link to="/contracts/requests">
                        <Button variant="secondary" className="relative">
                            <MessageSquareQuote className="mr-2 h-4 w-4" />
                            Xem Yêu cầu
                            {/* (Tùy chọn) Hiển thị badge nếu có yêu cầu mới */}
                            {pendingRequests.length > 0 && (
                                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                                    {pendingRequests.length}
                                </span>
                            )}
                        </Button>
                    </Link>

                    {/* Nút Tạo hợp đồng */}
                    <Link to="/contracts/add">
                        <Button>
                            <FilePlus className="mr-2 h-4 w-4" />
                            Tạo hợp đồng
                        </Button>
                    </Link>
                </div>
            </div>

            <DataTable
                columns={columns}
                data={contracts}
                isLoading={status === 'loading'}
                pagination={{
                    currentPage: pagination.currentPage,
                    totalPages: pagination.totalPages,
                    totalElements: pagination.totalElements,
                    onPageChange: handlePageChange,
                }}
            />

            <ConfirmModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleConfirmTerminate}
                title={`Chấm dứt Hợp đồng`}
                description={`Bạn có chắc chắn muốn chấm dứt hợp đồng cho phòng "${selectedContract?.roomNumber}" của khách "${selectedContract?.tenantName}" không?`}
                confirmText="Xác nhận"
            />
        </div>
    );
};

export default ContractListPage;