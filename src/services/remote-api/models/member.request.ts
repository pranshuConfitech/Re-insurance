export interface IMemberPageRequest {
    page: number;
    size: number;
    summary: boolean;
    active: boolean;
    sort?: string[];
    key?: string;
    value?: string;
    prospectId?: string;
}

export const memberDefaultPageRequest: IMemberPageRequest = {
    page: 0,
    size: 10,
    summary: true,
    active: true,
    prospectId: ''
}