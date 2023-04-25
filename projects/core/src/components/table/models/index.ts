import {Subject} from "rxjs";
import {OperationKey} from "../components/filter/filter.component";

export class TableConfig<T = any> {
  paging = new PagingConfig();
  sorting = new SortingConfig();
  selecting = new SelectingConfig();
  layout = new LayoutConfig();
  filter = new FilterConfig();

  lazyLoading: boolean = false;

  onRowClick = new Subject<T>();
  onRowSelect = new Subject<T>();
  onRowDeSelect = new Subject<T>();
  onStateChange = new Subject<State>();
  onFilterChange = new Subject<void>();
  onSortChange = new Subject<void>();
  onPageChange = new Subject<void>();
  onPageSizeChange = new Subject<void>();
}

export interface StateFilter {
  field: string;
  operation: OperationKey;
  value: string;
}

export interface State {
  page: number;
  pageSize: number;
  sortField: string;
  sortDir: 'asc' | 'desc';
  filters: StateFilter[];
}

export class SelectingConfig {
  enable = false;

  key = 'selected';
  mode: 'single' | 'multiple' = 'single';
  metaKey: boolean = false;
}

export class LayoutConfig {
  striped: boolean = true;
  bordered: boolean = true;
}

export class FilterConfig {

}

export class PagingConfig {
  enable = true;

  page = 0;
  size = 10;
  pageSizes = [10, 15, 25, 50, 100, 200, 500];
  pageReportTemplate = 'Showing {first} to {last} of {totalRecords} entries';
}

export class SortingConfig {
  enable = false;

  showNumbers = true;
  showRowCountSelect = true;
  showCurrentPageReport = true;

  field: string | SortFunc = '';
  dir: SortDir = 'asc';
}

export interface TableData<T = any> {
  totalCount: number;
  items: T[];
}

export type SortDir = 'asc' | 'desc';
export type SortFunc = (x1: any, x2: any, dir: SortDir) => number;
export type FilterFunc = (x: any) => boolean;
