import {
  Component,
  ContentChildren,
  Input,
  OnChanges,
  OnInit,
  QueryList,
  SimpleChanges,
  ViewChildren
} from "@angular/core";
import {TemplateDirective} from "../../directives/template/index.directive";
import {DataTableConfig, FilterFunc, SortFunc} from "./models";
import {DataTableSortDirective} from "./directives/sort.directive";
import {DataTableFilterDirective} from "./directives/filter.directive";
import {FormControl} from "@angular/forms";

@Component({
  selector: 'dev-table',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class DataTableComponent implements OnInit, OnChanges {

  @Input() items: any[] = [];
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

  @ContentChildren(DataTableFilterDirective)
  private set filterTemplates(value: QueryList<DataTableFilterDirective>) {
    this.filters = {};
    value?.forEach(x => this.filters[x.name] = x);
  }

  page = 0;
  renderedItems: any[] = [];

  pageRowCountControl = new FormControl(10);

  private sortIndex = -1;
  private sortAscending = true;
  private sortFunc?: SortFunc;

  constructor() {

  }

  ngOnChanges(changes: SimpleChanges): void {
    this.render();
  }

  ngOnInit(): void {
    this.render();

    this.pageRowCountControl.setValue(this.config.paging.rowCountPerPage);
  }

  render() {
    this.renderedItems = this.items.filter(x => true);
    this.renderedItems = this.filterItems(this.renderedItems);
    this.renderedItems = this.sortItems(this.renderedItems);
    this.renderedItems = this.pagingItems(this.renderedItems);
  }

  filterItems(items: any[]): any[] {
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

  sortItems(items: any[]): any[] {
    if (this.sortFunc) {
      const func = this.sortFunc;
      items = items.sort((x1, x2) => func(x1, x2, this.sortAscending));
    }
    return items;
  }

  pagingItems(items: any[]): any[] {
    if (this.config.settings.paging) {
      const start = this.page * this.config.paging.rowCountPerPage;
      items = items.slice(start, start + this.config.paging.rowCountPerPage);
    }
    return items;
  }
}
