import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchSettings, updateSettings, selectAllSettings, selectSettingsStatus } from '@/store/settings';
import { Button } from '@/components/shared/Button';
import { Input } from '@/components/shared/Input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/shared/Card';
import { Skeleton } from '@/components/shared/Skeleton';
import toast from '@/lib/toast';

// Kiểu dữ liệu cho form, key sẽ là các setting_key
type FormValues = Record<string, string>;

const SettingsPage = () => {
    const dispatch = useAppDispatch();
    const settings = useAppSelector(selectAllSettings);
    const status = useAppSelector(selectSettingsStatus);
    const isLoading = status === 'loading';

    const { register, handleSubmit, reset, formState: { isSubmitting, isDirty } } = useForm<FormValues>();

    // Fetch dữ liệu cài đặt khi vào trang
    useEffect(() => {
        dispatch(fetchSettings());
    }, [dispatch]);

    // Điền dữ liệu vào form sau khi fetch thành công
    useEffect(() => {
        if (settings.length > 0) {
            const defaultValues = settings.reduce((acc, setting) => {
                acc[setting.key] = setting.value;
                return acc;
            }, {} as FormValues);
            reset(defaultValues);
        }
    }, [settings, reset]);

    const onSubmit = (data: FormValues) => {
        dispatch(updateSettings(data))
            .unwrap()
            .then(() => {
                toast.success('Cập nhật cài đặt thành công!');
                // Fetch lại dữ liệu mới nhất sau khi cập nhật
                dispatch(fetchSettings());
            })
            .catch((error) => toast.error(error as string));
    };

    const renderFormContent = () => {
        if (isLoading && settings.length === 0) {
            // Hiển thị Skeleton khi đang tải lần đầu
            return (
                <div className="space-y-6">
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-16 w-full" />
                </div>
            );
        }

        // Nhóm các cài đặt theo chủ đề (ví dụ)
        const priceSettings = settings.filter(s => s.key.startsWith('PRICE_'));
        const bankSettings = settings.filter(s => s.key.startsWith('BANK_'));

        return (
            <form onSubmit={handleSubmit(onSubmit)}>
                <Card>
                    <CardHeader>
                        <CardTitle>Đơn giá Dịch vụ</CardTitle>
                        <CardDescription>Cấu hình đơn giá điện, nước và các dịch vụ khác.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {priceSettings.map(setting => (
                            <div key={setting.key} className="space-y-2">
                                <label htmlFor={setting.key} className="font-medium">{setting.description}</label>
                                <Input
                                    id={setting.key}
                                    type="number"
                                    {...register(setting.key)}
                                    disabled={isSubmitting}
                                />
                            </div>
                        ))}
                    </CardContent>
                </Card>

                <Card className="mt-6">
                    <CardHeader>
                        <CardTitle>Thông tin Thanh toán</CardTitle>
                        <CardDescription>Thông tin tài khoản ngân hàng sẽ hiển thị trên hóa đơn.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {bankSettings.map(setting => (
                            <div key={setting.key} className="space-y-2">
                                <label htmlFor={setting.key} className="font-medium">{setting.description}</label>
                                <Input
                                    id={setting.key}
                                    {...register(setting.key)}
                                    disabled={isSubmitting}
                                />
                            </div>
                        ))}
                    </CardContent>
                </Card>

                <CardFooter className="mt-6 border-t pt-6">
                    <Button type="submit" isLoading={isSubmitting} disabled={!isDirty}>
                        Lưu thay đổi
                    </Button>
                </CardFooter>
            </form>
        );
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">Cài đặt Hệ thống</h1>
            {renderFormContent()}
        </div>
    );
};

export default SettingsPage;