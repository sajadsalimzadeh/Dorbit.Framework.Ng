import { AfterViewInit, Component, ContentChild, ContentChildren, EventEmitter, HostBinding, Injector, Input, Output, QueryList, SimpleChanges, TemplateRef, ViewChild } from "@angular/core";
import { MenuItem } from "primeng/api";
import { CustomTableColumn, CustomTableGroupOperation } from "./contracts";
import { PrimengComponent } from "../primeng.component";
import { Table, TableFilterEvent, TableRowExpandEvent } from "primeng/table";
import { saveAs } from 'file-saver';
import { Menu } from "primeng/menu";
import { QueryResult } from "@framework/contracts";
import { GroupOperationItem } from "../group-operation-result/index.component";
import moment from "jalali-moment";
import * as XLSX from 'xlsx';

@Component({
    standalone: false,
    selector: 'p-custom-table',
    templateUrl: './custom-table.component.html',
    styleUrl: './custom-table.component.scss',
})

export class CustomTableComponent extends PrimengComponent implements AfterViewInit {
    @Input() name?: string;
    @Input() value: any[] = [];
    @Input() loading: boolean = false;
    @Input() lazyLoading: boolean = false;
    @Input() columns: CustomTableColumn[] = [];
    @Input() breadcrumb?: MenuItem[];
    @Input() showInCard: boolean = true;
    @Input() showRowNumber: boolean = true;
    @Input() showExportButton: boolean = true;
    @Input() showResetButton: boolean = true;
    @Input() showAddButton: boolean = true;
    @Input() showEditButton: boolean = true;
    @Input() showDeleteButton: boolean = true;
    @Input() showColumnSelector: boolean = true;
    @Input() showEmptyMessage: boolean = true;
    @Input() filterType: 'menu' | 'inline' = 'inline';
    @Input() isSortable: boolean = true;
    @Input() isFilterable: boolean = true;
    @Input() rows: number = 12;
    @Input() rowsPerPageOptions: number[] = [5, 10, 12, 15, 20, 50, 100, 200];
    @Input() headerClass?: string;
    @Input() footerClass?: string;
    @Input() rowClassField?: string;
    @Input() stateStorage: 'session' | 'local' = 'local';
    @Input() stateKey: string = '';
    @Input() stateKeyPrefix: string = this.router.url;
    @Input() @HostBinding('class') size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' = 'md';
    @Input() tableSize?: 'small' | 'large';
    @Input() operationSize?: 'small' | 'large';
    @Input() operations: MenuItem[] = [];
    @Input() groupOperations: CustomTableGroupOperation[] = [];
    @Input() groupOperationNameField: string = 'name';
    @Input() dataKey: string = 'id';
    @Input() expandMode: 'single' | 'multiple' = 'single';
    @Input() expandedRowKeys: { [key: string]: boolean } = {};

    @Input() selectedItems: any[] = [];
    @Output() selectedItemsChange = new EventEmitter<any[]>();

    @Output() onAdd = new EventEmitter<any>();
    @Output() onEdit = new EventEmitter<any>();
    @Output() onDelete = new EventEmitter<any>();
    @Output() onReload = new EventEmitter<void>();
    @Output() isSaving = new EventEmitter<any>();
    @Output() onFilter = new EventEmitter<TableFilterEvent>();
    @Output() onRowMouseOver = new EventEmitter<any>();
    @Output() onRowExpand = new EventEmitter<TableRowExpandEvent>();
    @Output() onOperationClick = new EventEmitter<any>();
    @Output() onGroupOperationClick = new EventEmitter<any>();
    @Output() onRowDoubleClick = new EventEmitter<any>();

    @ContentChild('caption', { static: true }) captionTpl?: TemplateRef<any>;
    @ContentChild('header', { static: true }) headerTpl?: TemplateRef<any>;
    @ContentChild('body', { static: true }) bodyTpl?: TemplateRef<any>;
    @ContentChild('expandedrow', { static: true }) expandedrowTpl?: TemplateRef<any>;
    @ContentChild('operation', { static: true }) operationTpl?: TemplateRef<any>;
    @ContentChild('footer', { static: true }) footerTpl?: TemplateRef<any>;

    @ContentChildren(TemplateRef) templates!: QueryList<TemplateRef<any>>;

    @ViewChild('dt') dt!: Table;

    protected uniqueStateKey: string = '';

    hasFooter: boolean = false;
    isDeleteDialogVisible = false;
    groupInvoker?: (item: GroupOperationItem) => Promise<QueryResult>;
    innerGroupOperations: MenuItem[] = [];
    selectedColumns: CustomTableColumn[] = [];

    get storage() {
        return this.stateStorage == 'session' ? sessionStorage : localStorage;
    }

    get isStateChaged() {
        return this.dt?.filteredValue || this.dt?.sortField || this.storage.getItem(this.stateKey + '-selectedColumns') || this.storage.getItem(this.uniqueStateKey);
    }

    constructor(injector: Injector) {
        super(injector);
    }

    override ngOnInit(): void {
        super.ngOnInit();

        this.uniqueStateKey = this.stateKeyPrefix + '-' + this.stateKey;

        this.loadSelectedColumnState();
    }

    override ngOnChanges(changes: SimpleChanges): void {
        super.ngOnChanges(changes);
        if (changes['value']) {
            this.selectedItems.splice(0, this.selectedItems.length);

            if (this.value) {
                this.value.forEach((x, i) => {
                    if (typeof x._defaultOrder == 'undefined') x._defaultOrder = i
                });
            }

        }

        if (changes['groupOperations']) {
            this.innerGroupOperations = this.groupOperations.map(x => ({
                ...x,
                command: () => {
                    if (x.action) {
                        x.action();
                    }
                    if (x.command) {
                        const command = x.command;
                        this.showDialog('group-operation');
                        this.groupInvoker = (item: GroupOperationItem) => command(item);
                    }
                }
            }));
        }

        if (!this.operationSize) {
            if (this.size == 'sm' || this.size == 'xs') this.operationSize = 'small';
            else if (this.size == 'lg' || this.size == 'xl') this.operationSize = 'large';
        }

        if (!this.tableSize) {
            if (this.size == 'sm' || this.size == 'xs') this.tableSize = 'small';
            else if (this.size == 'lg' || this.size == 'xl') this.tableSize = 'large';
        }
    }

    ngAfterViewInit(): void {
        this.columns.forEach(column => {
            column.template = this.templates.find((x: any) => x._declarationTContainer.localNames && x._declarationTContainer.localNames[0] == column.templateName);
            if (column.headerTemplateName) {
                column.headerTemplate = this.templates.find((x: any) => x._declarationTContainer.localNames && x._declarationTContainer.localNames[0] == column.headerTemplateName);
            }

            if (column.footerTemplateName) {
                column.footerTemplate = this.templates.find((x: any) => x._declarationTContainer.localNames && x._declarationTContainer.localNames[0] == column.footerTemplateName);
            }

            if (column.footer || column.footerRender) {
                if (column.footer) column.footer = this.translateService.instant(column.footer);
                this.hasFooter = true;
            }
        })
    }

    saveSelectedColumnState() {
        this.storage.setItem(this.uniqueStateKey + '-selectedColumns', JSON.stringify(this.selectedColumns.map(x => x.field)));
    }

    loadSelectedColumnState() {
        const state = this.storage.getItem(this.uniqueStateKey + '-selectedColumns');
        if (state) {
            const selectedColumnFields = JSON.parse(state);
            this.selectedColumns = this.columns.filter(x => {
                if (x.field) return selectedColumnFields.includes(x.field)
                return !x.isHide;
            });
        } else {
            this.selectedColumns = this.columns.filter(x => !x.isHide);
        }
    }

    resetSelectedColumnState() {
        const storage = this.stateStorage == 'session' ? sessionStorage : localStorage;
        storage.removeItem(this.uniqueStateKey + '-selectedColumns');
    }

    showDeleteDialog(item: any) {
        this.selectedItem = item;
        this.isDeleteDialogVisible = true;
    }

    deleteItemApprove() {
        this.isDeleteDialogVisible = false;
        this.onDelete.emit(this.selectedItem)
    }

    exportToExcel() {
        const filteredValue = this.dt.filteredValue || this.value;
        const items = filteredValue.map(x => {
            const item: any = {};
            this.columns.forEach(col => {
                if (col.field) {
                    item[col.field] = x[col.field];
                }
            })
            return item;
        })
        const worksheet = XLSX.utils.json_to_sheet(items);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

        const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

        const blob = new Blob([wbout], { type: 'application/octet-stream' });
        saveAs(blob, location.hostname + this.router.url.replaceAll('/', '-') + `-${moment().format('YYYY-MM-DD-HH-mm-ss')}.xlsx`);
    }

    resetState() {
        const tableId = this.elementRef.nativeElement.querySelector('table.p-datatable-table')?.id;
        if (tableId) {
            const style = Array.from(document.head.querySelectorAll(`style`)).reverse().find(x => x.textContent.includes('#' + tableId) && x.textContent?.includes('th:nth-child'));
            if (style) {
                style.remove();
            }
        }

        this.dt.value.splice(0, this.dt.value.length, ...this.dt.value.sortBy(x => x._defaultOrder));

        this.dt.clearState();
        this.dt.reset();
        this.dt.restoreColumnOrder();
        this.resetSelectedColumnState();
        this.selectedColumns = this.columns.filter(x => !x.isHide);

    }

    filter(event: TableFilterEvent) {
        this.onFilter.emit(event);
    }

    showOperationMenu(item: any, menu: Menu, event: Event) {
        this.onOperationClick.emit(item);
        menu.toggle(event);
    }

    showGroupOperation(menu: Menu, event: Event) {
        this.onGroupOperationClick.emit(this.selectedItems);
        menu.show(event);
    }

    onSelect(item: any, event: boolean) {
        if (event) {
            this.selectedItems.push(item);
        } else {
            this.selectedItems.splice(this.selectedItems.indexOf(item), 1);
        }
        this.selectedItemsChange.emit(this.selectedItems);
    }

    onSelectAll(event: boolean) {
        if (event) {
            this.selectedItems = this.dt?.filteredValue?.slice() ?? this.value.slice();
        } else {
            this.selectedItems = [];
        }
        this.selectedItemsChange.emit(this.selectedItems);
    }

    onRowExpandHandler(event: TableRowExpandEvent) {
        const dataKey = event.data[this.dataKey];
        if (this.expandMode === 'single') {
            for (const key in this.expandedRowKeys) {
                this.expandedRowKeys[key] = false;
            }
            this.expandedRowKeys[dataKey] = true;
        } else {
            if(this.expandedRowKeys[dataKey]) this.expandedRowKeys[dataKey] = false;
            else this.expandedRowKeys[dataKey] = true;
        }
        this.onRowExpand.emit(event);
    }

    onRowDoubleClickHandler(event: Event, item: any) {
        this.onRowDoubleClick.emit(item);
    }
}
