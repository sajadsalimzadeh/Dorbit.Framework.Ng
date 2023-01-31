import {
  AfterViewInit,
  Component,
  ContentChildren, ElementRef,
  Input,
  OnChanges, OnDestroy,
  OnInit,
  QueryList,
  SimpleChanges, ViewChild, ViewChildren,
} from "@angular/core";
import {TemplateDirective} from "../../directives/template/template.directive";
import {DataTableConfig, SortFunc} from "./models";
import {DataTableSortDirective} from "./directives/sort.directive";
import {DataTableFilterDirective} from "./directives/filter.directive";
import {FormControl} from "@angular/forms";
import {TableService} from "./services/table.service";
import {config} from "rxjs";

@Component({
  selector: 'dev-table',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
  providers: [
    TableService,
  ]
})
export class DataTableComponent implements OnInit, OnChanges, OnDestroy, AfterViewInit {

  @Input() items: any[] = [];
  @Input() totalCount: number = 0;
  @Input() config: DataTableConfig = new DataTableConfig();

  captionTemplate?: TemplateDirective;
  headerTemplate?: TemplateDirective;
  filterTemplate?: TemplateDirective;
  bodyTemplate?: TemplateDirective;
  detailTemplate?: TemplateDirective;
  footerTemplate?: TemplateDirective;
  summaryTemplate?: TemplateDirective;
  paginationStartTemplate?: TemplateDirective;
  paginationEndTemplate?: TemplateDirective;

  @ContentChildren(TemplateDirective)
  set devTemplates(value: QueryList<TemplateDirective>) {
    this.captionTemplate = value.find(x => x.name == 'caption');
    this.headerTemplate = value.find(x => x.name == 'header');
    this.filterTemplate = value.find(x => x.name == 'filter');
    this.bodyTemplate = value.find(x => x.name == 'body');
    this.detailTemplate = value.find(x => x.name == 'detail');
    this.footerTemplate = value.find(x => x.name == 'footer');
    this.paginationStartTemplate = value.find(x => x.name == 'paginationStart');
    this.paginationEndTemplate = value.find(x => x.name == 'paginationEnd');
    this.summaryTemplate = value.find(x => x.name == 'summary');
  }

  @ContentChildren(DataTableSortDirective)
  private set sorts(value: QueryList<DataTableSortDirective>) {
    value?.forEach((x, index) => {
      x.onSort = () => {
        if (this.sortIndex == index) this.sortAscending = !this.sortAscending;
        else this.sortAscending = true;
        this.sortIndex = index;
        let func: SortFunc;
        if (typeof x.field === 'function') func = x.field;
        else if (x.field) {
          const field = x.field;
          func = (x1, x2, ascending) => {
            if (ascending) {
              return x1[field] < x2[field] ? 1 : (x1[field] < x2[field] ? -1 : 0);
            }
            return x1[field] < x2[field] ? -1 : (x1[field] < x2[field] ? 1 : 0);
          }
        }
        this.sortFunc = (x1, x2, ascending) => func(x1, x2, ascending);
        this.render();
      }
    });
  }

  filters: { [key: string]: DataTableFilterDirective } = {};
  renderedItems: any[] = [];
  pageNumbers: number[] = [];
  pageRowCountControl = new FormControl(10);
  intervals: any[] = [];

  private sortIndex = -1;
  private sortAscending = true;
  private sortFunc?: SortFunc;

  constructor(private tableService: TableService, private elementRef: ElementRef) {

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.totalCount == 0) this.totalCount = this.items.length;
    this.render();
  }

  ngOnInit(): void {

    this.intervals.push(setInterval(() => {
      this.sizingHeaderAndFooters();
    }, 50));

    this.pageRowCountControl.valueChanges.subscribe(e => this.render());
    this.pageRowCountControl.setValue(this.config.paging.limit);
  }

  ngOnDestroy(): void {
    this.intervals.forEach(x => clearInterval(x));
  }

  ngAfterViewInit(): void {
    this.render();
  }

  render() {
    this.createPageNumbers();

    this.renderedItems = this.items.filter(x => true);
    this.renderedItems = this.filterItems(this.renderedItems);
    this.renderedItems = this.sortItems(this.renderedItems);
    this.renderedItems = this.pagingItems(this.renderedItems);
  }

  private filterItems(items: any[]): any[] {
    //
    // Object.values(this.filters)?.forEach(x => {
    //   x.onChange = (() => this.render());
    //   let func: FilterFunc | undefined;
    //   if (x.control?.value && x.field) {
    //     const value = x.control.value as any;
    //     if (x.comparator) {
    //       const comparator = x.comparator;
    //       func = (x) => {
    //         return comparator(x);
    //       }
    //     } else if (x.field) {
    //       const field = x.field;
    //       if (x.operation == 'eq') func = (x) => x[field] == value;
    //       else if (x.operation == 'nq') func = (x) => x[field] != value;
    //       else if (x.operation == 'gt') func = (x) => x[field] > value;
    //       else if (x.operation == 'ge') func = (x) => x[field] >= value;
    //       else if (x.operation == 'lt') func = (x) => x[field] < value;
    //       else if (x.operation == 'le') func = (x) => x[field] <= value;
    //       else if (x.operation == 'in') {
    //         if (Array.isArray(value)) {
    //           const arr = value as any[];
    //           func = (x) => arr.includes(x[field]);
    //         }
    //       } else {
    //         const searchValue = value?.toString();
    //         func = (x) => {
    //           const str = x[field]?.toString() ?? '';
    //           return str.includes(searchValue)
    //         };
    //       }
    //     }
    //     if (typeof func === 'function') {
    //       const filedFund = func;
    //       items = items.filter(x => (filedFund(x)))
    //     }
    //   }
    // });
    return items;
  }

  private sortItems(items: any[]): any[] {
    if (this.sortFunc) {
      const func = this.sortFunc;
      items = items.sort((x1, x2) => func(x1, x2, this.sortAscending));
    }
    return items;
  }

  private pagingItems(items: any[]): any[] {
    if (this.config.settings.paging) {
      const start = this.config.paging.page * this.config.paging.limit;
      items = items.slice(start, start + this.config.paging.limit);
    }
    return items;
  }

  private createPageNumbers() {

    const lastPage = Math.floor(this.totalCount / this.config.paging.limit);
    if (this.config.paging.page > lastPage) this.config.paging.page = lastPage - 1;
    const currentPageNumber = this.config.paging.page + 1;

    if (lastPage <= 7) {
      this.pageNumbers = [];
      for (let i = 1; i < lastPage; i++) {
        this.pageNumbers.push(i);
      }
    } else {
      this.pageNumbers = [currentPageNumber];
      for (let i = 1; this.pageNumbers.length < 7; i++) {
        if (currentPageNumber - i > 0) this.pageNumbers.unshift(currentPageNumber - i);
        if (currentPageNumber + i <= lastPage) this.pageNumbers.push(currentPageNumber + i);
      }
      this.pageNumbers[0] = 1;
      if (this.pageNumbers[1] != 2) {
        this.pageNumbers[1] = 0;
      }
      if (this.pageNumbers[this.pageNumbers.length - 2] != lastPage - 1) {
        this.pageNumbers[this.pageNumbers.length - 2] = 0;
      }
      this.pageNumbers[this.pageNumbers.length - 1] = lastPage;
    }
  }

  sizingHeaderAndFooters() {
    const el = this.elementRef.nativeElement as HTMLElement;
    const header_ths = el.querySelectorAll('.data .header thead:first-child>tr th');
    const footer_ths = el.querySelectorAll('.data .footer tfoot:first-child>tr th');
    const data_tds = el.querySelectorAll('.data-table tbody:first-child>tr td');

    data_tds.forEach((td, index) => {
      const header_th = header_ths.item(index) as HTMLElement;
      if (header_th) header_th.style.width = td.clientWidth + 'px';
      const footer_th = footer_ths.item(index) as HTMLElement;
      if (footer_th) footer_th.style.width = td.clientWidth + 'px';
    })
  }

  selectPage(page: number) {
    if (!page) return;
    this.config.paging.page = page - 1;
    this.render();
  }
}
