export interface Equipment {
    id?: string;
    name: string;
    sectionId: number;
    facultyId: number;
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
