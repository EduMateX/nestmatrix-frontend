import React from 'react';
import clsx from 'clsx';

// Sử dụng React.HTMLAttributes để nhận tất cả các props của thẻ div
const Card = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <div
        className={clsx('rounded-lg border bg-card text-card-foreground shadow-sm', className)}
        {...props}
    />
);

const CardHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <div className={clsx('flex flex-col space-y-1.5 p-6', className)} {...props} />
);

const CardTitle = ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3
        className={clsx('text-2xl font-semibold leading-none tracking-tight', className)}
        {...props}
    />
);

const CardDescription = ({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p
        className={clsx('text-sm text-gray-500 dark:text-gray-400', className)}
        {...props}
    />
);

const CardContent = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <div className={clsx('p-6 pt-0', className)} {...props} />
);

const CardFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <div
        className={clsx('flex items-center p-6 pt-0', className)}
        {...props}
    />
);


export {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter
};