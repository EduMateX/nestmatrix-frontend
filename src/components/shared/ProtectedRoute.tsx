// src/components/shared/ProtectedRoute.tsx
import { Navigate, Outlet } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { selectIsAuthenticated, selectAuthStatus, fetchUserProfile } from '@/store/auth';
import { useEffect } from 'react';
import { Spinner } from '@/components/shared/Spinner';

const ProtectedRoute = () => {
    const dispatch = useAppDispatch();
    const isAuthenticated = useAppSelector(selectIsAuthenticated);
    const authStatus = useAppSelector(selectAuthStatus);

    // useEffect này sẽ chạy một lần khi component được mount
    useEffect(() => {
        // Nếu redux chưa xác thực và đang ở trạng thái 'idle' (chưa làm gì)
        if (!isAuthenticated && authStatus === 'idle') {
            // Dispatch action để thử lấy thông tin user.
            // Nếu có cookie hợp lệ, backend sẽ trả về thông tin user.
            // Nếu cookie không hợp lệ, action sẽ bị reject.
            dispatch(fetchUserProfile());
        }
    }, [isAuthenticated, authStatus, dispatch]);

    // Trong khi đang chờ kết quả từ fetchUserProfile, hiển thị màn hình loading
    if (authStatus === 'loading' || authStatus === 'idle') {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-gray-100">
                <Spinner size="lg" />
            </div>
        );
    }

    // Nếu đã kiểm tra xong và kết quả là không xác thực được, chuyển về trang login
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // Nếu đã xác thực thành công, hiển thị các trang con được bảo vệ
    return <Outlet />;
};

export default ProtectedRoute;