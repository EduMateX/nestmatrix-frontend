import clsx from 'clsx';

interface AvatarProps {
    src?: string;
    alt?: string;
    fallback: string;
    className?: string;
}

export const Avatar = ({ src, alt, fallback, className }: AvatarProps) => {
    return (
        <div
            className={clsx(
                'relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gray-200 text-gray-600 font-semibold',
                className
            )}
        >
            {src ? (
                <img className="aspect-square h-full w-full object-cover" src={src} alt={alt} />
            ) : (
                <span>{fallback}</span>
            )}
        </div>
    );
};