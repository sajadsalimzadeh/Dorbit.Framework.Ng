import {AfterViewInit, Component, ContentChildren, forwardRef, HostBinding, HostListener, Injector, Input, OnChanges, OnDestroy, OnInit, QueryList, SimpleChanges, TemplateRef} from "@angular/core";
import {TemplateDirective} from "../../directives/template.directive";
import {FilterFunc, SortFunc, TableConfig, TableData} from "./models";
import {FormControl} from "@angular/forms";
import {TableService} from "./services/table.service";
import {OverlayService} from "../overlay/overlay.component";
import {OperationKey} from "./components/filter/filter.component";
import {AbstractComponent} from "../abstract.component";
import {TableTemplateDirective} from "./components/table-template.directive";

@Component({
    selector: 'd-table',
    templateUrl: './table.component.html',
    styleUrls: ['./table.component.scss'],
    providers: [
        TableService,
        {provide: TableTemplateDirective, useExisting: forwardRef(() => TemplateDirective)}
    ],
    standalone: false
})
export class TableComponent extends AbstractComponent implements OnInit, OnChanges, OnDestroy, AfterViewInit {

    @Input() data: TableData = {totalCount: 0, items: []};
    @Input() config: TableConfig = new TableConfig();
    @HostBinding('class.has-scroll') hasScroll: boolean = false;
    captionTemplate?: TemplateRef<any>;
    headerTemplate?: TemplateRef<any>;
    filterTemplate?: TemplateRef<any>;
    bodyTemplate?: TemplateRef<any>;
    detailTemplate?: TemplateRef<any>;
    footerTemplate?: TemplateRef<any>;
    summaryTemplate?: TemplateRef<any>;
    tableService: TableService;
    overlayService: OverlayService;
    filteredItems: any[] = [];
    sortedItems: any[] = [];
    pagedItems: any[] = [];
    renderedItems: any[] = [];
    pageRowCountControl = new FormControl(10);
    intervals: any[] = [];
    isMetaKeyDown: boolean = false;
    totalCount: number = 0;

    constructor(injector: Injector) {
        super(injector);
        this.tableService = injector.get(TableService);
        this.overlayService = injector.get(OverlayService);

        this.tableService.dataTable = this;
    }

    @HostBinding('class.table-striped')
    get isTableStriped() {
        return this.config.layout.striped;
    }

    @HostBinding('class.table-bordered')
    get isTableBordered() {
        return this.config.layout.bordered;
    }

    @HostBinding('class.hovered')
    get isTableHovered() {
        return this.config.layout.hovered;
    }

    @HostBinding('class.selectable')
    get isSelectable() {
        return this.config.selecting.enable;
    }

    @ContentChildren(TemplateDirective)
    set dTemplates(value: QueryList<TemplateDirective>) {
        this.captionTemplate = value.find(x => x.includesName('caption'))?.template;
        this.headerTemplate = value.find(x => x.includesName('header'))?.template;
        this.filterTemplate = value.find(x => x.includesName('filter'))?.template;
        this.bodyTemplate = value.find(x => x.includesName('body'))?.template;
        this.detailTemplate = value.find(x => x.includesName('detail'))?.template;
        this.footerTemplate = value.find(x => x.includesName('footer'))?.template;
        this.summaryTemplate = value.find(x => x.includesName('summary'))?.template;
    }

    @ContentChildren(TableTemplateDirective)
    set dTableTemplates(value: QueryList<TableTemplateDirective>) {
        this.dTemplates = value;
    }

    set pageReportTemplate(value: string) {
        const el = this.elementRef.nativeElement?.querySelector('.current-page-report') as HTMLElement;
        if (el) {
            el.innerHTML = value;
        }
    }

    @HostListener('window:keydown', ['$event']) onWindowKeydown(e: KeyboardEvent) {
        if (e.key == 'Control') this.isMetaKeyDown = true;
    }

    @HostListener('window:keyup', ['$event']) onWindowKeyup(e: KeyboardEvent) {
        if (e.key == 'Control') this.isMetaKeyDown = false;
    }

    override ngOnInit(): void {
        this.pageRowCountControl.setValue(this.config.paging.size);

        this.subscription.add(this.loadingService.$loading.subscribe(e => {
            const dataEl = this.elementRef.nativeElement.querySelector('.data');
            if (dataEl) {
                if (e) dataEl.classList.add('loading');
                else dataEl.classList.remove('loading');
            }
        }));

        this.subscription.add(this.config.onRowClick.subscribe(item => {
            if (this.config.selecting.enable) {
                const clearSelectedRow = () => {
                    this.data.items.filter(x => x[this.config.selecting.key] && x != item).forEach(x => {
                        x[this.config.selecting.key] = false;
                        this.config.onRowDeSelect.next(x);
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
        }));

        this.subscription.add(this.tableService.onFilterChange.subscribe(() => {
            this.render();
            this.config.onFilterChange.next();
        }));

        this.subscription.add(this.tableService.onSortChange.subscribe(() => {
            this.config.onSortChange.next();
        }));

        this.subscription.add(this.config.onFilterChange.subscribe(() => this.stateChange()));
        this.subscription.add(this.config.onSortChange.subscribe(() => this.stateChange()));
        this.subscription.add(this.config.onPageChange.subscribe(() => this.stateChange()));
        this.subscription.add(this.config.onPageSizeChange.subscribe(() => this.stateChange()));

        if (this.config.sorting.field) {
            setTimeout(() => {
                this.tableService.onSortChange.next({
                    field: this.config.sorting.field,
                    dir: this.config.sorting.dir,
                });
            }, 50);
        }
    }

    override ngOnChanges(changes: SimpleChanges): void {
        if (!this.data) {
            this.data = {
                totalCount: 0,
                items: []
            }
        }
        if (!this.data.totalCount) {
            this.data.totalCount = this.data.items.length;
        }
        this.render();
    }

    override ngAfterViewInit(): void {
        this.render();
    }

    override ngOnDestroy(): void {
        this.intervals.forEach(x => clearInterval(x));
    }

    selectItem(item: any) {
        const isRowSelected = item[this.config.selecting.key];
        if (!isRowSelected) {
            this.config.onRowSelect.next(item);
        }
        item[this.config.selecting.key] = true;
    }

    toggleSelectItem(item: any) {
        const isRowSelected = item[this.config.selecting.key];
        item[this.config.selecting.key] = !item[this.config.selecting.key];
        if (isRowSelected) {
            this.config.onRowDeSelect.next(item);
        } else {
            this.config.onRowSelect.next(item);
        }
    }

    override render() {
        super.render();

        this.renderedItems = this.data.items.filter(() => true);

        if (!this.config.lazyLoading) {
            this.filteredItems = this.renderedItems = this.filterItems(this.renderedItems);
            this.sortedItems = this.renderedItems = this.sortItems(this.renderedItems);
            this.pagedItems = this.renderedItems = this.pagingItems(this.renderedItems);
        }

        this.totalCount = (this.config.lazyLoading ? this.data.totalCount : this.filteredItems.length);
        const first = this.config.paging.page * this.config.paging.size + 1;
        let last = first + this.config.paging.size - 1;
        if (last > this.totalCount) last = this.totalCount;
        this.pageReportTemplate = this.config.paging.pageReportTemplate
            .replace('{totalRecords}', this.totalCount.toString())
            .replace('{first}', first.toString())
            .replace('{last}', last.toString());
    }

    onPageSizeChange() {
        this.config.onPageSizeChange.next();
        this.render();
    }

    onPageChange(page: number) {
        this.config.paging.page = page;
        this.config.onPageChange.next();
        this.render();
    }

    private stateChange() {
        this.config.onStateChange.next({
            page: this.config.paging.page,
            pageSize: this.config.paging.size,
            sortField: (typeof this.config.sorting.field === 'string' ? this.config.sorting.field : null) as string,
            sortDir: this.config.sorting.dir,
            filters: this.tableService.filters.map(x => {
                return {
                    field: x.field as string,
                    operation: x.operationControl.value as OperationKey,
                    value: x.valueControl.value as any
                };
            })
        })
    }

    private filterItems(items: any[]): any[] {
        this.tableService.filters.forEach(x => {
            let func: FilterFunc | undefined;
            if (x.operationControl?.value && x.valueControl.value && x.field) {
                let value = x.valueControl.value as any;
                if (typeof value === 'string') value = value.toLowerCase();
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
}
