import { ReactNode } from 'react';
import { Spinner } from './Spinner';
import { Button } from './Button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface Column<T> {
    header: string;
    accessor: keyof T;
    render?: (item: T) => ReactNode;
}

interface DataTableProps<T> {
    data: T[];
    columns: Column<T>[];
    isLoading?: boolean;
    pagination?: {
        currentPage: number;
        totalPages: number;
        totalElements: number;
        onPageChange: (page: number) => void;
    }
}

export function DataTable<T extends { id: number | string }>({ data, columns, isLoading = false, pagination }: DataTableProps<T>) {
    return (
        <div className="rounded-lg border shadow-sm bg-white">
            <div className="relative w-full overflow-auto">
                <table className="w-full caption-bottom text-sm">
                    <thead className="[&_tr]:border-b bg-gray-50">
                        <tr className="border-b transition-colors hover:bg-muted/50">
                            {columns.map((col) => (
                                <th key={String(col.accessor)} className="h-12 px-4 text-left align-middle font-medium text-gray-500">
                                    {col.header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="[&_tr:last-child]:border-0 divide-y divide-gray-200">
                        {isLoading ? (
                            <tr>
                                <td colSpan={columns.length} className="p-24 text-center">
                                    <Spinner />
                                </td>
                            </tr>
                        ) : data.length === 0 ? (
                            <tr>
                                <td colSpan={columns.length} className="p-24 text-center text-gray-500">
                                    Không có dữ liệu.
                                </td>
                            </tr>
                        ) : (
                            data.map((item) => (
                                <tr key={item.id} className="transition-colors hover:bg-gray-50/50">
                                    {columns.map((col) => (
                                        <td key={String(col.accessor)} className="p-4 align-middle">
                                            {col.render ? col.render(item) : String(item[col.accessor] ?? '')}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {pagination && pagination.totalPages > 1 && (
                <div className="flex items-center justify-between p-4 border-t">
                    <div className="text-sm text-muted-foreground">
                        Tổng số {pagination.totalElements} bản ghi.
                    </div>
                    <div className="flex items-center space-x-2">
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => pagination.onPageChange(pagination.currentPage - 1)}
                            disabled={pagination.currentPage === 0}
                        >
                            <ChevronLeft className="h-4 w-4" />
                            <span>Trước</span>
                        </Button>
                        <span className="text-sm font-medium">
                            Trang {pagination.currentPage + 1} / {pagination.totalPages}
                        </span>
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => pagination.onPageChange(pagination.currentPage + 1)}
                            disabled={pagination.currentPage >= pagination.totalPages - 1}
                        >
                            <span>Sau</span>
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}