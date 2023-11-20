export interface CommandResult {
  success: boolean;
  message?: string;
  code?: number;
}

export interface QueryResult<T = any> extends CommandResult {
  data?: T;
}

export interface PagedListResult<T = any> extends QueryResult<T[]> {
  totalCount: number;
}

export interface OdataPagedListResult<T = any> extends PagedListResult<T> {
  value: T[];
}
