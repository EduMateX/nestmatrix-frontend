import { useEffect, useState, useMemo, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';

// Redux imports
import { fetchIncidentsByBuilding, deleteIncident, selectAllIncidents, selectIncidentsStatus, Incident, IncidentPriority, IncidentStatus, clearIncidents } from '@/store/incidents';
import { fetchBuildings, selectAllBuildings, selectBuildingsStatus } from '@/store/buildings';

// Component imports
import { Column, DataTable } from '@/components/shared/DataTable';
import { Button } from '@/components/shared/Button';
import { ConfirmModal } from '@/components/shared/ConfirmModal';
import { Select, SelectOption } from '@/components/shared/Select';
import { Pencil, Trash2 } from 'lucide-react';
import toast from '@/lib/toast';
import { UpdateStatusModal } from './UpdateStatusModal';
import { Card, CardContent } from '@/components/shared/Card';

const IncidentListPage = () => {
    const dispatch = useAppDispatch();

    // State for modals and selections
    const [selectedBuildingId, setSelectedBuildingId] = useState<number | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);

    // Redux state selectors
    const incidents = useAppSelector(selectAllIncidents);
    const status = useAppSelector(selectIncidentsStatus);
    const buildings = useAppSelector(selectAllBuildings);
    const buildingsStatus = useAppSelector(selectBuildingsStatus);

    // Fetch danh sách tòa nhà (chỉ một lần)
    useEffect(() => {
        if (buildingsStatus === 'idle') {
            dispatch(fetchBuildings({ page: 0, size: 100 }));
        }
    }, [buildingsStatus, dispatch]);


    // Tự động chọn tòa nhà đầu tiên
    useEffect(() => {
        if (buildingsStatus === 'succeeded' && buildings.length > 0 && selectedBuildingId === null) {
            setSelectedBuildingId(buildings[0].id);
        }
    }, [buildings, buildingsStatus, selectedBuildingId]);

    // Fetch danh sách sự cố khi `selectedBuildingId` thay đổi
    useEffect(() => {
        if (selectedBuildingId) {
            dispatch(fetchIncidentsByBuilding(selectedBuildingId));
        } else {
            // Dọn dẹp state nếu không có tòa nhà nào được chọn
            dispatch(clearIncidents());
        }
    }, [selectedBuildingId, dispatch]);

    const handleBuildingChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedBuildingId(Number(e.target.value) || null);
    }, []);

    // Modal handlers
    const handleOpenDeleteModal = (incident: Incident) => {
        setSelectedIncident(incident);
        setIsDeleteModalOpen(true);
    };

    const handleOpenUpdateModal = (incident: Incident) => {
        setSelectedIncident(incident);
        setIsUpdateModalOpen(true);
    };

    const handleConfirmDelete = () => {
        if (selectedIncident) {
            dispatch(deleteIncident(selectedIncident.id))
                .unwrap()
                .then(() => toast.success(`Đã xóa sự cố: "${selectedIncident.title}"`))
                .catch((error) => toast.error(error as string))
                .finally(() => setIsDeleteModalOpen(false));
        }
    };

    // Helper functions for rendering badges
    const getStatusBadge = (status: IncidentStatus) => {
        const styles: Record<IncidentStatus, string> = {
            [IncidentStatus.REPORTED]: "bg-blue-100 text-blue-800",
            [IncidentStatus.IN_PROGRESS]: "bg-yellow-100 text-yellow-800",
            [IncidentStatus.RESOLVED]: "bg-green-100 text-green-800",
            [IncidentStatus.CLOSED]: "bg-gray-100 text-gray-800",
        };
        return <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${styles[status]}`}>{status.replace('_', ' ')}</span>;
    };

    const getPriorityBadge = (priority: IncidentPriority) => {
        const styles: Record<IncidentPriority, string> = {
            [IncidentPriority.LOW]: "bg-gray-100 text-gray-800",
            [IncidentPriority.MEDIUM]: "bg-yellow-100 text-yellow-800",
            [IncidentPriority.HIGH]: "bg-orange-100 text-orange-800",
            [IncidentPriority.CRITICAL]: "bg-red-100 text-red-800",
        };
        return <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${styles[priority]}`}>{priority}</span>;
    };

    // Columns definition for DataTable
    const columns: Column<Incident>[] = [
        { header: 'Tiêu đề', accessor: 'title', render: (i) => <span className="font-medium">{i.title}</span> },
        { header: 'Phòng', accessor: 'roomNumber' },
        { header: 'Người báo cáo', accessor: 'reportedByName' },
        { header: 'Ngày báo cáo', accessor: 'reportedAt', render: (i) => new Date(i.reportedAt).toLocaleString('vi-VN') },
        { header: 'Trạng thái', accessor: 'status', render: (i) => getStatusBadge(i.status) },
        { header: 'Ưu tiên', accessor: 'priority', render: (i) => getPriorityBadge(i.priority) },
        {
            header: 'Hành động',
            accessor: 'id',
            render: (incident) => (
                <div className="flex gap-2">
                    <Button variant="secondary" size="sm" onClick={() => handleOpenUpdateModal(incident)} title="Cập nhật trạng thái">
                        <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="danger" size="sm" onClick={() => handleOpenDeleteModal(incident)} title="Xóa sự cố">
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            ),
        },
    ];

    const buildingOptions: SelectOption[] = useMemo(() => buildings.map(b => ({ value: b.id, label: b.name })), [buildings]);

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Quản lý Sự cố</h1>
                    <p className="text-muted-foreground">Xem và xử lý các sự cố được báo cáo từ các tòa nhà.</p>
                </div>
                {/* Nút tạo mới có thể thêm ở đây nếu admin cũng có thể tạo sự cố */}
            </div>

            <Card>
                <CardContent className="pt-6">
                    <div className="w-full md:w-1/3">
                        <label className="font-medium mb-2 block">Lọc theo Tòa nhà</label>
                        <Select
                            options={buildingOptions}
                            placeholder="-- Chọn tòa nhà để xem sự cố --"
                            value={selectedBuildingId || ""}
                            onChange={handleBuildingChange}
                            disabled={buildingsStatus === 'loading' || buildings.length === 0}
                        />
                    </div>
                </CardContent>
            </Card>

            {selectedBuildingId && (
                <DataTable
                    columns={columns}
                    data={incidents}
                    isLoading={status === 'loading'}
                />
            )}

            {/* Modals */}
            <ConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Xác nhận xóa sự cố"
                description={`Bạn có chắc chắn muốn xóa sự cố "${selectedIncident?.title}" không? Hành động này không thể hoàn tác.`}
            />
            <UpdateStatusModal
                isOpen={isUpdateModalOpen}
                onClose={() => setIsUpdateModalOpen(false)}
                incident={selectedIncident}
            />
        </div>
    );
};

export default IncidentListPage;