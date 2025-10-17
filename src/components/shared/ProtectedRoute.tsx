import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAppSelector } from '@/store/hooks';
import { selectIsAuthenticated } from '@/store/auth';

const ProtectedRoute = () => {
    const isAuthenticated = useAppSelector(selectIsAuthenticated);
    const location = useLocation();

    if (!isAuthenticated) {
        // Nếu không xác thực, chuyển hướng về login
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Nếu đã xác thực, render trang con
    return <Outlet />;
};

export default ProtectedRoute;