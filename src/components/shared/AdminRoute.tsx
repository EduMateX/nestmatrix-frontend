import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAppSelector } from '@/store/hooks';
import { selectCurrentUser } from '@/store/auth';

const AdminRoute = () => {
    const currentUser = useAppSelector(selectCurrentUser);
    const location = useLocation();

    // Kiểm tra xem có thông tin user không và vai trò có phải là ADMIN không
    if (currentUser && currentUser.role === 'ADMIN') {
        // Nếu đúng là ADMIN, cho phép truy cập (render các trang con)
        return <Outlet />;
    }

    // Nếu đã đăng nhập nhưng không phải ADMIN
    if (currentUser) {
        // Chuyển hướng đến một trang "Không có quyền truy cập"
        // Hoặc có thể chuyển hướng về trang dashboard của user (nếu có)
        return <Navigate to="/unauthorized" state={{ from: location }} replace />;
    }

    // Trường hợp hiếm gặp: chưa có thông tin user (đang loading hoặc chưa đăng nhập)
    // ProtectedRoute ở ngoài sẽ xử lý việc chuyển hướng đến /login
    return <Navigate to="/login" state={{ from: location }} replace />;
};

export default AdminRoute;