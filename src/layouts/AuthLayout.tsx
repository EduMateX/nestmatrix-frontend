import { Outlet } from 'react-router-dom';
import logo from '@/assets/logo.svg';

const AuthLayout = () => {
    return (
        <main className="relative flex h-screen w-full flex-col items-center justify-center overflow-hidden bg-gray-50">
            {/* Background Gradient */}
            <div className="absolute inset-0 z-0 opacity-50">
                <div className="absolute bottom-0 left-[-20%] right-0 top-[-10%] h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle_farthest-side,rgba(100,100,255,.15),rgba(255,255,255,0))]"></div>
                <div className="absolute bottom-[-10%] right-[-20%] top-0 h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle_farthest-side,rgba(100,200,255,.15),rgba(255,255,255,0))]"></div>
            </div>

            {/* Container chính, cho phép cuộn nội bộ nếu cần trên màn hình cực nhỏ */}
            <div className="relative z-10 w-full max-w-md overflow-y-auto rounded-xl bg-white/70 p-6 shadow-xl backdrop-blur-md md:p-8">
                {/* Logo */}
                <div className="mb-6 flex justify-center">
                    <img src={logo} alt="NestMatrix Logo" className="h-12 w-12" />
                </div>

                {/* Nơi render các trang con */}
                <Outlet />
            </div>
        </main>
    );
};

export default AuthLayout;