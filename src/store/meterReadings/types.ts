export interface MeterReading {
    id: number;
    roomId: number;
    readingMonth: number;
    readingYear: number;
    oldElectricNumber: number;
    newElectricNumber: number;
    electricConsumption: number;
    oldWaterNumber: number;
    newWaterNumber: number;
    waterConsumption: number;
    readingDate: string; // 'YYYY-MM-DD'
    electricImageUrl?: string;
    waterImageUrl?: string;
    invoiceGenerated?: boolean;
}

export interface MeterReadingsState {
    items: MeterReading[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

export interface RecordReadingPayload {
    roomId: number;
    readingMonth: number;
    readingYear: number;
    newElectricNumber: number;
    newWaterNumber: number;
    electricImage?: File;
    waterImage?: File;
}