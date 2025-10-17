import { createContext, useState, useContext, ReactNode } from 'react';

interface BreadcrumbContextType {
    dynamicSegment: string | null;
    setDynamicSegment: (name: string | null) => void;
}

const BreadcrumbContext = createContext<BreadcrumbContextType | undefined>(undefined);

export const BreadcrumbProvider = ({ children }: { children: ReactNode }) => {
    const [dynamicSegment, setDynamicSegment] = useState<string | null>(null);

    return (
        <BreadcrumbContext.Provider value={{ dynamicSegment, setDynamicSegment }}>
            {children}
        </BreadcrumbContext.Provider>
    );
};

export const useBreadcrumb = () => {
    const context = useContext(BreadcrumbContext);
    if (context === undefined) {
        throw new Error('useBreadcrumb must be used within a BreadcrumbProvider');
    }
    return context;
};