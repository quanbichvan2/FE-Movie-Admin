export interface director {
    id: string;
    name: string;
}

export interface directorResponse {
    items: director[];
    pageIndex: number;
    totalPages: number;
    totalCount: number;
    pageSize: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
}