// src/pages/profile/ProfilePage.tsx
import { useAppSelector } from '@/store/hooks';
import { selectCurrentUser } from '@/store/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/shared/Card';
import { Avatar } from '@/components/shared/Avatar';

const ProfilePage = () => {
    // Lấy thông tin user hiện tại từ Redux store
    const currentUser = useAppSelector(selectCurrentUser);

    if (!currentUser) {
        return (
            <div className="flex h-full items-center justify-center">
                <p>Không tìm thấy thông tin người dùng. Vui lòng thử lại.</p>
            </div>
        );
    }

    const getAvatarFallback = (name: string) => {
        if (!name) return '??';
        return name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
    }

    return (
        <div className="container mx-auto max-w-3xl space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Thông tin tài khoản</h1>
                <p className="text-muted-foreground">Xem và chỉnh sửa thông tin cá nhân của bạn.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Chi tiết Profile</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col items-center gap-6 sm:flex-row">
                        <Avatar
                            fallback={getAvatarFallback(currentUser.fullName)}
                            className="h-24 w-24 text-3xl"
                        // src={currentUser.avatarUrl} // Nếu có ảnh đại diện
                        />
                        <div className="grid gap-2 text-center sm:text-left">
                            <div className="font-semibold text-2xl">{currentUser.fullName}</div>
                            <div className="text-gray-500">{currentUser.email}</div>
                            <div className="mt-1 inline-block rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-800 w-fit mx-auto sm:mx-0">
                                {currentUser.role}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Cài đặt</CardTitle>
                </CardHeader>
                <CardContent>
                    {/* Nội dung cho các cài đặt khác, ví dụ: đổi mật khẩu */}
                    <p>Chức năng đổi mật khẩu sẽ được phát triển sau.</p>
                </CardContent>
            </Card>
        </div>
    );
};

export default ProfilePage;