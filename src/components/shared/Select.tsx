// src/components/shared/Select.tsx
import React, { forwardRef } from 'react';
import clsx from 'clsx';

export interface SelectOption {
    label: string;
    value: string | number;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    options: SelectOption[];
    placeholder?: string;
    error?: boolean;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
    ({ className, options, placeholder, error, ...props }, ref) => {
        return (
            <select
                ref={ref}
                className={clsx(
                    'flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
                    error && 'border-red-500 focus:ring-red-500',
                    className
                )}
                {...props}
            >
                {placeholder && <option value="">{placeholder}</option>}
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        );
    }
);

Select.displayName = 'Select';