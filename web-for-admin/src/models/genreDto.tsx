export interface Genre {
    id: string;
    name: string;
  }
  
  export interface GenreResponse {
    items: Genre[];
    pageIndex: number;
    totalPages: number;
    totalCount: number;
    pageSize: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
  }
  