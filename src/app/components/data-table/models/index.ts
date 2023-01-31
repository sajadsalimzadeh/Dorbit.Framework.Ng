export class DataTableConfig {
  paging = new PagingConfig();
  sorting = new SortingConfig();
  settings = new Settings();
}

export class PagingConfig {
  page = 0;
  limit = 10;
  limits = [10,15,25,50,100];
  pageReportTemplate = 'Showing {first} to {last} of {totalRecords} entries';
}

export class SortingConfig {

}

export class Settings {
  paging = true;
  sorting = true;

  pageNumbers = true;
  pageNextPrevControl = true;
  pageFirstLastControl = true;
  pageRowCountSelect = true;
  currentPageReport = true;
}

export type SortFunc = (x1: any, x2: any, ascending: boolean) => number;
export type FilterFunc = (x: any) => boolean;
