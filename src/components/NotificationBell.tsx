import { useEffect } from 'react';
import { Bell } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchUnreadCount, selectUnreadCount } from '@/store/notifications';
import { Dropdown, DropdownMenuItem } from '@/components/shared/Dropdown';

const NotificationBell = () => {
    const dispatch = useAppDispatch();
    const unreadCount = useAppSelector(selectUnreadCount);

    useEffect(() => {
        // Fetch số lượng chưa đọc khi component mount
        dispatch(fetchUnreadCount());
    }, [dispatch]);

    const BellButton = (
        <button className="relative rounded-full p-2 hover:bg-gray-100 focus:outline-none">
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                    {unreadCount > 9 ? '9+' : unreadCount}
                </span>
            )}
        </button>
    );

    return (
        <Dropdown button={BellButton} menuWidth="w-80">
            <div className="px-1 py-1">
                <div className="px-2 py-2 font-semibold">Thông báo</div>
                {/* Logic hiển thị danh sách thông báo gần nhất ở đây */}
                <DropdownMenuItem>
                    <p className="text-sm text-gray-500 p-4 text-center">Chưa có thông báo nào.</p>
                </DropdownMenuItem>
            </div>
        </Dropdown>
    );
}

export default NotificationBell;