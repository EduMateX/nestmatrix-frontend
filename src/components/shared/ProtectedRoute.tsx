import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { selectIsAuthenticated, selectAuthStatus, fetchUserProfile } from '@/store/auth';
import { useEffect, useState } from 'react';
import { Spinner } from '@/components/shared/Spinner';

const ProtectedRoute = () => {
    const dispatch = useAppDispatch();
    const location = useLocation();

    const isAuthenticated = useAppSelector(selectIsAuthenticated);
    const authStatus = useAppSelector(selectAuthStatus);

    // Thêm một state local để chỉ kiểm tra token một lần khi app tải
    const [isVerifying, setIsVerifying] = useState(true);

    useEffect(() => {
        // Chỉ chạy logic này MỘT LẦN khi app tải lần đầu
        // để kiểm tra xem có cookie hợp lệ không.
        if (!isAuthenticated && authStatus === 'idle') {
            dispatch(fetchUserProfile())
                .finally(() => {
                    // Dù thành công hay thất bại, việc kiểm tra đã xong
                    setIsVerifying(false);
                });
        } else {
            // Nếu đã có trạng thái xác thực (true hoặc false sau khi fetch), không cần kiểm tra nữa
            setIsVerifying(false);
        }
    }, [authStatus, dispatch, isAuthenticated]);

    // Nếu đang trong quá trình kiểm tra token lần đầu
    if (isVerifying) {
        return (
            <div className="flex h-screen w-full items-center justify-center">
                <Spinner size="lg" />
            </div>
        );
    }

    // Nếu đã kiểm tra xong và không xác thực được
    if (!isAuthenticated) {
        // Lưu lại trang người dùng muốn vào để có thể chuyển hướng lại sau khi đăng nhập
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Nếu đã xác thực, render trang con
    return <Outlet />;
};

export default ProtectedRoute;