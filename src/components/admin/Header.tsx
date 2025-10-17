import { Link, useLocation } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";
import { UserNav } from "@/components/admin/UserNav";
import { useBreadcrumb } from "@/context/BreadcrumbContext";

const breadcrumbNameMap: { [key: string]: string } = {
    'dashboard': 'Dashboard',
    'buildings': 'Quản lý Tòa nhà',
    'add': 'Thêm mới',
    'edit': 'Chỉnh sửa',
    'rooms': 'Quản lý Phòng',
    'tenants': 'Quản lý Khách thuê',
    'contracts': 'Quản lý Hợp đồng',
    'incidents': 'Quản lý Sự cố',
    'meter-readings': 'Ghi chỉ số Điện Nước',
};


export function Header() {
    const location = useLocation();
    const { dynamicSegment } = useBreadcrumb();
    const pathnames = location.pathname.split('/').filter(x => x);

    return (
        <header className="flex h-16 items-center gap-4 border-b bg-white px-6 sticky top-0 z-30">
            <div className="w-full flex-1">
                <nav className="flex items-center text-sm font-medium text-gray-500">
                    <Link to="/dashboard" className="hover:text-gray-700">
                        <Home className="h-4 w-4" />
                    </Link>
                    {pathnames.map((value, index) => {
                        const to = `/${pathnames.slice(0, index + 1).join('/')}`;
                        const isLast = index === pathnames.length - 1;

                        // Ưu tiên tên động từ context nếu là segment cuối cùng
                        let displayName = isLast && dynamicSegment ? dynamicSegment : (breadcrumbNameMap[value] || value);

                        // Xử lý đặc biệt cho "edit" để thêm tiền tố "Chỉnh sửa"
                        if (isLast && pathnames[index - 1] === 'edit' && dynamicSegment) {
                            displayName = `${breadcrumbNameMap['edit']} ${dynamicSegment}`;
                        }

                        return (
                            <span key={to} className="flex items-center">
                                <ChevronRight className="mx-2 h-4 w-4" />
                                {isLast ? (
                                    <span className="text-gray-800 font-semibold capitalize">{displayName}</span>
                                ) : (
                                    <Link to={to} className="hover:text-gray-700 capitalize">
                                        {breadcrumbNameMap[value] || value}
                                    </Link>
                                )}
                            </span>
                        );
                    })}
                </nav>
            </div>


            <div className="flex items-center gap-4">
                <UserNav />
            </div>
        </header>
    );
}