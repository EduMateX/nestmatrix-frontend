import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import toast from '@/lib/toast';

// Components tự xây dựng
import { Button } from '@/components/shared/Button';
import { Input } from '@/components/shared/Input';
import { Checkbox } from '@/components/shared/Checkbox';

// Redux
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { loginAction, selectAuthStatus, selectAuthError, clearAuthError } from '@/store/auth';

// Định nghĩa schema validation với Zod
const formSchema = z.object({
    email: z.string().email({ message: 'Email không hợp lệ.' }),
    password: z.string().min(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự.' }),
});
type LoginFormValues = z.infer<typeof formSchema>;

const LoginPage = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const authStatus = useAppSelector(selectAuthStatus);
    const authError = useAppSelector(selectAuthError);
    const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

    const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: { email: 'kaidev99.pro@icloud.com', password: '123456aA@' },
    });

    const isLoading = authStatus === 'loading';

    const onSubmit = (values: LoginFormValues) => {
        dispatch(loginAction(values));
    };

    // Xử lý sau khi action Redux hoàn thành
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/dashboard');
        }
        if (authStatus === 'failed' && authError) {
            toast.error(authError);
            dispatch(clearAuthError());
        }
    }, [isAuthenticated, authStatus, authError, navigate, dispatch]);

    return (
        <>
            <div className="text-center">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">Login</h1>
                <p className="mt-2 text-sm text-gray-600">
                    Haven't got an account?{' '}
                    <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">
                        Sign Up
                    </Link>
                </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
                <div className="space-y-4 rounded-md shadow-sm">
                    <div className='space-y-2'>
                        <label htmlFor="email-address" className="text-sm font-medium text-gray-700">
                            Email or Username
                        </label>
                        <Input
                            id="email-address"
                            type="email"
                            autoComplete="email"
                            placeholder="Taskcover@gmail.com"
                            {...register('email')}
                            error={!!errors.email}
                            disabled={isLoading}
                            className="rounded-t-md"
                        />
                        {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
                    </div>
                    <div className='space-y-2'>
                        <label htmlFor="password" className="text-sm font-medium text-gray-700">Password</label>
                        <Input
                            id="password"
                            type="password"
                            autoComplete="current-password"
                            placeholder="••••••••"
                            {...register('password')}
                            error={!!errors.password}
                            disabled={isLoading}
                            className="rounded-b-md"
                        />
                        {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
                    </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center">
                        <Checkbox id="remember-me" {...register('remember')} />
                        <label htmlFor="remember-me" className="ml-2 block text-gray-900">
                            Remember me
                        </label>
                    </div>
                    <Link to="/forgot-password" className="font-medium text-blue-600 hover:text-blue-500">
                        Forgot password
                    </Link>
                </div>

                <div>
                    <Button type="submit" className="w-full" isLoading={isLoading} size="lg">
                        Login
                    </Button>
                </div>
            </form>

            {/* Phần đăng nhập với Google */}
            <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                    <span className="bg-white/80 px-2 text-gray-500">or login by</span>
                </div>
            </div>

            <div>
                <Button type="button" variant="secondary" className="w-full" size="lg">
                    {/* Thêm icon Google SVG hoặc từ lucide-react ở đây */}
                    <span className="ml-2">Google</span>
                </Button>
            </div>
        </>
    );
};

export default LoginPage;