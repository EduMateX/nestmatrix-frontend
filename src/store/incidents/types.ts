export enum IncidentStatus {
    REPORTED = "REPORTED",
    IN_PROGRESS = "IN_PROGRESS",
    RESOLVED = "RESOLVED",
    CLOSED = "CLOSED"
}

export enum IncidentPriority {
    LOW = "LOW",
    MEDIUM = "MEDIUM",
    HIGH = "HIGH",
    CRITICAL = "CRITICAL"
}

export interface Incident {
    id: number;
    title: string;
    description: string;
    roomId: number;
    roomNumber: string;
    reportedById: number;
    reportedByName: string;
    reportedAt: string; // ISO Date String
    status: IncidentStatus;
    priority: IncidentPriority;
    imageUrl?: string;
    resolvedAt?: string;
}

export interface IncidentsState {
    items: Incident[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

export interface UpdateIncidentStatusPayload {
    id: number;
    status: IncidentStatus;
    priority?: IncidentPriority;
}