export interface Column {
    field: string;
    header: string;
    sort?: boolean;
    fieldType?: string;
    disabled?: boolean;
    [key: string]: any;
}

export interface PagingState {
    pageSize?: number;
    pageOffset?: number;
    sortField?: string;
    sortOrder?: number;
}
