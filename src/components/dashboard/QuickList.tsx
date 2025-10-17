import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/shared/Card';
import { Skeleton } from '@/components/shared/Skeleton';
import { QuickListItem } from '@/store/dashboard';
import { Link } from 'react-router-dom';

interface QuickListProps {
    title: string;
    description: string;
    items: QuickListItem[] | undefined;
    linkTo: string; // Link đến trang chi tiết, ví dụ /contracts
    isLoading: boolean;
}

export const QuickList = ({ title, description, items, linkTo, isLoading }: QuickListProps) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <div className="space-y-4">
                        <Skeleton className="h-12 w-full" />
                        <Skeleton className="h-12 w-full" />
                        <Skeleton className="h-12 w-full" />
                    </div>
                ) : !items || items.length === 0 ? (
                    <p className="text-sm text-center text-muted-foreground py-4">Không có dữ liệu.</p>
                ) : (
                    <div className="space-y-4">
                        {items.slice(0, 5).map(item => ( // Chỉ hiển thị 5 item đầu tiên
                            <Link to={`${linkTo}/${item.id}`} key={item.id} className="block hover:bg-gray-50 p-2 rounded-md">
                                <div className="flex items-center space-x-4">
                                    <div className="flex-1 space-y-1">
                                        <p className="text-sm font-medium leading-none">{item.title}</p>
                                        <p className="text-sm text-muted-foreground">{item.subtitle}</p>
                                    </div>
                                    <div className="text-sm text-muted-foreground">{item.date}</div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}