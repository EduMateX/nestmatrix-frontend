// src/layouts/components/Sidebar.tsx
import { NavLink } from "react-router-dom";
import clsx from "clsx";
import {
    LayoutDashboard,
    Building2,
    DoorOpen,
    Users,
    FileText,
    ClipboardList,
    Wrench,
    Bell,
    Settings
} from "lucide-react";
import logo from '@/assets/logo.svg'; // Thay bằng logo của bạn

// Định nghĩa cấu trúc menu
const menuItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Quản lý Tòa nhà', href: '/buildings', icon: Building2 },
    { name: 'Quản lý Phòng', href: '/rooms', icon: DoorOpen },
    { name: 'Quản lý Khách thuê', href: '/tenants', icon: Users },
    { name: 'Quản lý Hợp đồng', href: '/contracts', icon: FileText },
    { name: 'Điện & Nước', href: '/meter-readings', icon: ClipboardList },
    { name: 'Quản lý Hóa đơn', href: '/invoices', icon: Bell },
    { name: 'Quản lý Sự cố', href: '/incidents', icon: Wrench },
    { name: 'Cài đặt', href: '/settings', icon: Settings },
];

export function Sidebar() {
    return (
        // 'hidden lg:block' -> Sidebar sẽ ẩn trên mobile và tablet
        <aside className="hidden lg:flex lg:flex-col w-64 flex-shrink-0 border-r bg-gray-50">
            <div className="flex h-16 items-center border-b px-6">
                <NavLink to="/dashboard" className="flex items-center gap-2 font-semibold text-lg text-gray-800">
                    <img src={logo} className="h-8 w-8" alt="Logo" />
                    <span>Nhà Của Tui</span>
                </NavLink>
            </div>
            <div className="flex-1 overflow-y-auto">
                <nav className="flex flex-col gap-1 p-4 text-sm font-medium">
                    {menuItems.map((item) => (
                        <NavLink
                            key={item.name}
                            to={item.href}
                            // Sử dụng callback của `className` để xác định trạng thái active
                            className={({ isActive }) => clsx(
                                "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-600 transition-all hover:bg-gray-200/60 hover:text-gray-900",
                                {
                                    "bg-blue-100/80 text-blue-700 font-bold hover:bg-blue-100 hover:text-blue-800": isActive,
                                }
                            )}
                        >
                            <item.icon className="h-5 w-5" />
                            {item.name}
                        </NavLink>
                    ))}
                </nav>
            </div>
        </aside>
    );
}