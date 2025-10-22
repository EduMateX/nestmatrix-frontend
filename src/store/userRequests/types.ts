export enum RequestType {
    CONTRACT_RENEWAL = "CONTRACT_RENEWAL",
    CONTRACT_TERMINATION = "CONTRACT_TERMINATION",
    CHANGE_PAYMENT_CYCLE = "CHANGE_PAYMENT_CYCLE"
}

export interface UserRequest {
    id: number;
    userName: string;
    roomNumber: string;
    type: RequestType;
    message: string;
    requestedValue: string;
    createdAt: string; // ISO Date String
    isResolved: boolean;
}

export interface UserRequestsState {
    items: UserRequest[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}