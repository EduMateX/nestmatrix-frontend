import { Button } from '@/components/shared/Button';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';

const UnauthorizedPage = () => {
    const navigate = useNavigate();

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 text-center">
            <ShieldAlert className="h-16 w-16 text-red-500" />
            <h1 className="mt-4 text-4xl font-bold tracking-tight text-gray-900">
                Truy cập bị từ chối
            </h1>
            <p className="mt-4 text-base text-gray-500">
                Bạn không có quyền truy cập vào trang này.
            </p>
            <Button onClick={() => navigate(-1)} className="mt-6">
                Quay lại trang trước
            </Button>
        </div>
    );
};

export default UnauthorizedPage;