export interface CastMember {
    id: string;
    name: string;
}

export interface CastMembersResponse {
    items: CastMember[];
    pageIndex: number;
    totalPages: number;
    totalCount: number;
    pageSize: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
}