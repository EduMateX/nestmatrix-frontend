export interface User {
    id: string;
    name: string;
    email: string;
}

export interface UsersState {
    list: User[];
    loading: 'idle' | 'pending' | 'succeeded' | 'failed';
    error: string | null;
}