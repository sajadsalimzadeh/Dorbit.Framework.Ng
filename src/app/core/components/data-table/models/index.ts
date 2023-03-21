
export class DataTableConfig {
  paging = new PagingConfig();
  sorting = new SortingConfig();
  selecting = new SelectingConfig();
  layout = new LayoutConfig();

  settings = new Settings();
}

export class SelectingConfig {
  enable = true;

  key = 'selected';
  mode: 'single' | 'multiple' = 'single';
  metaKey: boolean = false;
}

export class LayoutConfig {
  striped: boolean = true;
  bordered: boolean = true;
}

export class PagingConfig {
  enable = true;

  page = 0;
  size = 10;
  pageSizes = [10, 15, 25, 50, 100, 200, 500];
  pageReportTemplate = 'Showing {first} to {last} of {totalRecords} entries';
}

export class SortingConfig {
  enable = true;

  showNumbers = true;
  showRowCountSelect = true;
  showCurrentPageReport = true;

  field: string | SortFunc = '';
  dir: SortDir = 'asc';
}

export class Settings {
}

export type SortDir = 'asc' | 'desc';
export type SortFunc = (x1: any, x2: any, dir: SortDir) => number;
export type FilterFunc = (x: any) => boolean;
