import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchUserProfile, selectCurrentUser } from '@/store/auth';
import { Spinner } from './Spinner';

const PersistLogin = () => {
    const dispatch = useAppDispatch();
    const currentUser = useAppSelector(selectCurrentUser);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        const verifyUser = async () => {
            // Chỉ fetch khi chưa có thông tin user
            if (!currentUser && isMounted) {
                try {
                    await dispatch(fetchUserProfile()).unwrap();
                } catch (error) {
                    console.error("Failed to fetch user on app load:", error);
                }
            }
            if (isMounted) {
                setIsLoading(false);
            }
        };

        verifyUser();

        // Cleanup function
        return () => { isMounted = false };
    }, [dispatch, currentUser]); // Phụ thuộc vào currentUser

    // Hiển thị loading trong khi đang xác thực token
    if (isLoading) {
        return (
            <div className="flex h-screen w-full items-center justify-center">
                <Spinner size="lg" />
            </div>
        );
    }

    // Sau khi xác thực xong, render các route con
    return <Outlet />;
};

export default PersistLogin;