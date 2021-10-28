export interface User {
    id?: number;
    name: string;
    email: string;
    celular: number;
    dni: number;
    sectionId: string;
    password: string;
    role: string;
    facultyId: string;
    address: string;
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
