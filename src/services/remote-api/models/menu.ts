export interface Menu {
    icon: string;
    displayName: string;
    routePath?: string;
    children?: Menu[];
}