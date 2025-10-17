// src/components/shared/SearchInput.tsx
import { useState, useEffect } from 'react';
import { Input } from './Input';
import { Search } from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';

interface SearchInputProps {
    initialValue?: string;
    onSearchChange: (keyword: string) => void;
    placeholder?: string;
    debounceDelay?: number;
}

export const SearchInput = ({
    initialValue = '',
    onSearchChange,
    placeholder = 'Tìm kiếm...',
    debounceDelay = 500
}: SearchInputProps) => {
    const [keyword, setKeyword] = useState(initialValue);
    const debouncedKeyword = useDebounce(keyword, debounceDelay);

    // Gọi callback khi giá trị đã debounce thay đổi
    useEffect(() => {
        onSearchChange(debouncedKeyword);
    }, [debouncedKeyword, onSearchChange]);

    return (
        <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
                type="search"
                placeholder={placeholder}
                className="pl-9" // Thêm padding bên trái để không che icon
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
            />
        </div>
    );
};