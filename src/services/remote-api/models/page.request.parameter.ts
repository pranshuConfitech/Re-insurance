export interface IParameterPageRequest {
    page: number;
    size: number;
    summary: boolean;
    active: boolean;
    sort?: string[];
    type: string;
}

export const defaultParameterPageRequest: IParameterPageRequest = {
    page: 0,
    size: 10,
    summary: true,
    active: true,
    type: 'all'
}