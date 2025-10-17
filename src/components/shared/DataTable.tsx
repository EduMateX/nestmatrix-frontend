import { ReactNode } from 'react';
import { Spinner } from './Spinner';

// Định nghĩa kiểu cho một cột
export interface Column<T> {
    header: string;
    accessor: keyof T; // Key của object data
    render?: (item: T) => ReactNode; // Hàm render tùy chỉnh
}

interface DataTableProps<T> {
    data: T[];
    columns: Column<T>[];
    isLoading?: boolean;
}

export function DataTable<T extends { id: number | string }>({ data, columns, isLoading = false }: DataTableProps<T>) {
    return (
        <div className="rounded-lg border shadow-sm">
            <div className="relative w-full overflow-auto">
                <table className="w-full caption-bottom text-sm">
                    <thead className="[&_tr]:border-b bg-gray-50">
                        <tr className="border-b transition-colors hover:bg-muted/50">
                            {columns.map((col) => (
                                <th key={String(col.accessor)} className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                                    {col.header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="[&_tr:last-child]:border-0">
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
                                <tr key={item.id} className="border-b transition-colors hover:bg-gray-50/50">
                                    {columns.map((col) => (
                                        <td key={String(col.accessor)} className="p-4 align-middle">
                                            {col.render ? col.render(item) : String(item[col.accessor])}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}