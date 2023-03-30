import {
  AfterViewInit,
  Component,
  ContentChildren, EventEmitter, HostBinding, HostListener, Injector,
  Input,
  OnChanges, OnDestroy,
  OnInit, Output,
  QueryList,
  SimpleChanges, TemplateRef
} from "@angular/core";
import {TemplateDirective} from "../../directives/template/template.directive";
import {DataTableConfig, FilterFunc, SortFunc} from "./models";
import {FormControl} from "@angular/forms";
import {TableService} from "./services/table.service";
import {OverlayService} from "../overlay/overlay.service";
import {BaseComponent} from "../base.component";

@Component({
  selector: 'd-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  providers: [
    TableService,
  ]
})
export class TableComponent extends BaseComponent implements OnInit, OnChanges, OnDestroy, AfterViewInit {

  @Input() items: any[] = [];
  @Input() totalCount: number = 0;
  @Input() config: DataTableConfig = new DataTableConfig();

  @Output() onRowClick = new EventEmitter<any>();
  @Output() onRowSelect = new EventEmitter<any>();
  @Output() onRowDeSelect = new EventEmitter<any>();

  @HostBinding('class.table-striped')
  get isTableStriped() {
    return this.config.layout.striped;
  }

  @HostBinding('class.table-bordered')
  get isTableBordered() {
    return this.config.layout.bordered;
  }

  @HostBinding('class.selectable')
  get isSelectable() {
    return this.config.selecting.enable;
  }

  @HostBinding('class.has-scroll') hasScroll: boolean = false;


  @HostListener('window:keydown', ['$event']) onWindowKeydown(e: KeyboardEvent) {
    if (e.key == 'Control') this.isMetaKeyDown = true;
  }

  @HostListener('window:keyup', ['$event']) onWindowKeyup(e: KeyboardEvent) {
    if (e.key == 'Control') this.isMetaKeyDown = false;
  }

  captionTemplate?: TemplateRef<any>;
  headerTemplate?: TemplateRef<any>;
  filterTemplate?: TemplateRef<any>;
  bodyTemplate?: TemplateRef<any>;
  detailTemplate?: TemplateRef<any>;
  footerTemplate?: TemplateRef<any>;
  summaryTemplate?: TemplateRef<any>;
  paginationStartTemplate?: TemplateRef<any>;

  @ContentChildren(TemplateDirective)
  set dTemplates(value: QueryList<TemplateDirective>) {
    this.captionTemplate = value.find(x => x.includesName('caption'))?.template;
    this.headerTemplate = value.find(x => x.includesName('header'))?.template;
    this.filterTemplate = value.find(x => x.includesName('filter'))?.template;
    this.bodyTemplate = value.find(x => x.includesName('body'))?.template;
    this.detailTemplate = value.find(x => x.includesName('detail'))?.template;
    this.footerTemplate = value.find(x => x.includesName('footer'))?.template;
    this.paginationStartTemplate = value.find(x => x.includesName('paginationStart'))?.template;
    this.summaryTemplate = value.find(x => x.includesName('summary'))?.template;
  }

  renderedItems: any[] = [];
  pageNumbers: number[] = [];
  pageRowCountControl = new FormControl(10);
  intervals: any[] = [];
  isMetaKeyDown: boolean = false;

  pageReportTemplate: string = '';
  dataScrollBarStyles: any = {};
  dataScrollBarWidth: number = 20;
  dataTableScrollThumbStyles: any = {};

  constructor(injector: Injector, private tableService: TableService, overlayService: OverlayService) {
    super(injector);
    tableService.dataTable = this;
    overlayService.singleton = false;
  }

  override ngOnInit(): void {
    this.pageRowCountControl.valueChanges.subscribe(e => this.render());
    this.pageRowCountControl.setValue(this.config.paging.size);

    this.onRowClick.subscribe(item => {
      if (this.config.selecting.enable) {
        const clearSelectedRow = () => {
          this.items.filter(x => x[this.config.selecting.key] && x != item).forEach(x => {
            x[this.config.selecting.key] = false;
            this.onRowDeSelect.emit(x);
          });
        };

        if (this.config.selecting.mode == 'single') {
          clearSelectedRow();
          this.selectItem(item);
        }
        if (this.config.selecting.metaKey) {
          if (this.isMetaKeyDown) {
            this.toggleSelectItem(item);
          } else {
            clearSelectedRow();
            this.selectItem(item);
          }
        } else if (this.config.selecting.mode == 'multiple') {
          this.toggleSelectItem(item);
        }
      }
    });

    this.tableService.onFilterChange.subscribe(() => {
      this.render();
    });

    if (this.config.sorting.field) {
      setTimeout(() => {
        this.tableService.onSortChange.next({
          field: this.config.sorting.field,
          keepDirection: true,
        });
      }, 50);
    }
  }

  override ngOnChanges(changes: SimpleChanges): void {
    if (this.totalCount == 0) this.totalCount = this.items.length;
    this.render();
  }

  ngAfterViewInit(): void {
    this.render();
  }

  override ngOnDestroy(): void {
    this.intervals.forEach(x => clearInterval(x));
  }

  selectItem(item: any) {
    const isRowSelected = item[this.config.selecting.key];
    if (!isRowSelected) {
      this.onRowSelect.emit(item);
    }
    item[this.config.selecting.key] = true;
  }

  toggleSelectItem(item: any) {
    const isRowSelected = item[this.config.selecting.key];
    item[this.config.selecting.key] = !item[this.config.selecting.key];
    if (isRowSelected) {
      this.onRowDeSelect.emit(item);
    } else {
      this.onRowSelect.emit(item);
    }
  }

  override render() {
    super.render();

    this.renderedItems = this.items.filter(() => true);
    this.renderedItems = this.filterItems(this.renderedItems);
    this.renderedItems = this.sortItems(this.renderedItems);
    this.renderedItems = this.pagingItems(this.renderedItems);

    setTimeout(() => {
      this.sizingHeaderAndFooters();
    }, 10);

    const first = this.config.paging.page * this.config.paging.size + 1;
    const last = first + this.config.paging.size - 1;
    this.pageReportTemplate = this.config.paging.pageReportTemplate
      .replace('{totalRecords}', this.totalCount.toString())
      .replace('{first}', first.toString())
      .replace('{last}', last.toString());
  }

  private filterItems(items: any[]): any[] {
    this.tableService.filters.forEach(x => {
      let func: FilterFunc | undefined;
      if (x.operationControl?.value && x.valueControl.value && x.field) {
        let value = x.valueControl.value as any;
        if(typeof value === 'string') value = value.toLowerCase();
        if (x.comparator) {
          const comparator = x.comparator;
          func = (x) => {
            return comparator(x);
          }
        } else if (x.field) {
          const field = x.field;
          const op = x.operationControl.value;
          if (op == 'eq') func = (x) => x[field] == value;
          else if (op == 'nq') func = (x) => x[field] != value;
          else if (op == 'gt') func = (x) => x[field] > value;
          else if (op == 'ge') func = (x) => x[field] >= value;
          else if (op == 'lt') func = (x) => x[field] < value;
          else if (op == 'le') func = (x) => x[field] <= value;
          else if (op == 'in' || op == 'ni' || op == 'sw' || op == 'ew') {
            const searchValue = value?.toString();
            func = (x) => {
              const str = (x[field]?.toString()?.toLowerCase() ?? '') as string;
              if (op == 'in') return str.includes(searchValue);
              else if (op == 'ni') return !str.includes(searchValue);
              else if (op == 'sw') return str.startsWith(searchValue);
              else if (op == 'ew') return str.endsWith(searchValue);
              return false;
            };
          }
        }
        if (typeof func === 'function') {
          const filedFund = func;
          items = items.filter(x => (filedFund(x)))
        }
      }
    });
    return items;
  }

  private sortItems(items: any[]): any[] {
    const field = this.config.sorting.field;
    const dir = this.tableService.config.sorting.dir;

    let func: SortFunc = () => 0;
    if (typeof field === 'function') func = field;
    else if (field) {
      func = (x1, x2, dir) => {
        if (dir == 'asc') {
          return x1[field] < x2[field] ? -1 : (x1[field] > x2[field] ? 1 : 0);
        }
        return x1[field] < x2[field] ? 1 : (x1[field] > x2[field] ? -1 : 0);
      }
    }
    return items.sort((x1, x2) => func(x1, x2, dir));
  }

  private pagingItems(items: any[]): any[] {
    if (this.config.paging.enable) {
      const start = this.config.paging.page * this.config.paging.size;
      items = items.slice(start, start + this.config.paging.size);
    }
    return items;
  }

  sizingHeaderAndFooters() {
    // const el = this.elementRef.nativeElement as HTMLElement;
    //
    // const dataEl = el.querySelector('.data') as HTMLElement;
    //
    // const dataTableEl = dataEl.querySelector('.data-table .scroll-container') as HTMLElement;
    // this.dataScrollBarWidth = dataTableEl.offsetWidth - dataTableEl.clientWidth;
    //
    // const dataHeaderEl = dataEl.querySelector('.data-header') as HTMLElement;
    // const dataFooterEl = dataEl.querySelector('.data-footer') as HTMLElement;
    //
    // dataHeaderEl.style.paddingInlineEnd = this.dataScrollBarWidth + 'px';
    // dataFooterEl.style.paddingInlineEnd = this.dataScrollBarWidth + 'px';
    //
    // const header_ths = dataHeaderEl.querySelectorAll('thead:first-child>tr th');
    // const footer_ths = dataFooterEl.querySelectorAll('tfoot:first-child>tr th');
    // const data_tds = dataTableEl.querySelectorAll('.data-table tbody:first-child>tr td');
    //
    // data_tds.forEach((td, index) => {
    //   const header_th = header_ths.item(index) as HTMLElement;
    //   if (header_th) header_th.style.width = td.clientWidth + 1 + 'px';
    //   const footer_th = footer_ths.item(index) as HTMLElement;
    //   if (footer_th) footer_th.style.width = td.clientWidth + 1 + 'px';
    // })
  }

  onPageSelect(page: number) {
    this.config.paging.page = page;
    this.render();
  }
}
