export interface Incidents {
    id?: number;
    issue: string;
    description: string;
    equipmentId: number;
    type: string;
    attended?: string;
    userId: number;
    
}
