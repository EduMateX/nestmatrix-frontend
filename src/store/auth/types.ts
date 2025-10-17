export interface UserProfile {
    id: number;
    fullName: string;
    email: string;
    role: 'ADMIN' | 'USER';
}

export interface AuthState {
    isAuthenticated: boolean;
    user: UserProfile | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}