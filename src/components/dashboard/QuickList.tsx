import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/shared/Card';
import { Skeleton } from '@/components/shared/Skeleton';
import { QuickListItem } from '@/store/dashboard';
import { LucideIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

interface QuickListProps {
    title: string;
    description: string;
    items: QuickListItem[] | undefined;
    linkTo: string;
    icon: LucideIcon;
    isLoading: boolean;
}

export const QuickList = ({ title, description, items, linkTo, icon: Icon, isLoading }: QuickListProps) => {

    // Component skeleton cho một item
    const SkeletonItem = () => (
        <div className="flex items-center space-x-4 p-2">
            <Skeleton className="h-8 w-8 rounded-full" />
            <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
            </div>
        </div>
    );

    return (
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <div className="space-y-4">
                        <SkeletonItem />
                        <SkeletonItem />
                        <SkeletonItem />
                    </div>
                ) : !items || items.length === 0 ? (
                    <p className="text-sm text-center text-muted-foreground py-4">Không có dữ liệu.</p>
                ) : (
                    <div className="space-y-1">
                        {items.slice(0, 5).map(item => ( // Chỉ hiển thị 5 item đầu tiên
                            <Link to={`${linkTo}/${item.id}`} key={item.id} className="block hover:bg-gray-50 p-2 rounded-md -mx-2">
                                <div className="flex items-center space-x-4">
                                    <div className="p-2 bg-muted rounded-full">
                                        <Icon className="h-4 w-4 text-muted-foreground" />
                                    </div>
                                    <div className="flex-1 space-y-1">
                                        <p className="text-sm font-medium leading-none truncate">{item.title}</p>
                                        <p className="text-sm text-muted-foreground truncate">{item.subtitle}</p>
                                    </div>
                                    {item.date && (
                                        <div className="text-xs text-muted-foreground">{item.date}</div>
                                    )}
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}