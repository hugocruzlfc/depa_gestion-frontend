export interface Plans {
    id?: number;
    facultyId: number;
    sectionId: number;
    description: string;
    starDate: Date;
    done?: string;
    sections?: {
        id: number;
        name: string;
    };
    facultys?: {
        id: number;
        name: string;
        campus: string
    };
}
