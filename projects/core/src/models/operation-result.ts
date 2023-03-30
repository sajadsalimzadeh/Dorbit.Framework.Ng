export interface OperationResult<T = any> {
    success: boolean;
    message?: string;
    code?: number;
}

export interface QueryResult<T> extends OperationResult {
    data?: T;
}

export interface PagedListResult<T = any> extends QueryResult<T[]> {
    indexFrom: number;
    pageIndex: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    items: T[];
}
export interface OdataPagedListResult<T = any> extends PagedListResult<T>{
  value: T[];
}
