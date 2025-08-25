import { AfterViewInit, Component, ContentChild, ContentChildren, EventEmitter, HostBinding, Injector, Input, Output, QueryList, TemplateRef, ViewChild } from "@angular/core";
import { MenuItem } from "primeng/api";
import { CustomTableColumn } from "./contracts";
import { PrimengComponent } from "../primeng.component";
import { Table, TableFilterEvent } from "primeng/table";
import { saveAs } from 'file-saver';
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
    @Input() showColumnSelector: boolean = true;
    @Input() showEmptyMessage: boolean = true;
    @Input() filterType: 'menu' | 'inline' = 'inline';
    @Input() isSortable: boolean = true;
    @Input() isFilterable: boolean = true;
    @Input() rows: number = 12;
    @Input() rowsPerPageOptions: number[] = [5, 10, 12, 15, 20, 50];
    @Input() headerClass?: string;
    @Input() rowClassField?: string;
    @Input() stateStorage: 'session' | 'local' = 'session';
    @Input() stateKey: string = this.router.url;
    @Input()
    @HostBinding('class') size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' = 'md';
    @Input() operationSize?: 'small' | 'large';

    @Output() onAdd = new EventEmitter<any>();
    @Output() onEdit = new EventEmitter<any>();
    @Output() onDelete = new EventEmitter<any>();
    @Output() isSaving = new EventEmitter<any>();
    @Output() onFilter = new EventEmitter<TableFilterEvent>();
    @Output() onRowMouseOver = new EventEmitter<any>();

    @ContentChild('caption') captionTpl?: TemplateRef<any>;
    @ContentChild('header') headerTpl?: TemplateRef<any>;
    @ContentChild('body') bodyTpl?: TemplateRef<any>;
    @ContentChild('expandedrow') expandedrowTpl?: TemplateRef<any>;
    @ContentChild('operation') operationTpl?: TemplateRef<any>;

    @ContentChildren(TemplateRef) templates!: QueryList<TemplateRef<any>>;

    @ViewChild('dt') dt!: Table;

    isDeleteDialogVisible = false;
    selectedColumns: CustomTableColumn[] = [];

    get storage() {
        return this.stateStorage == 'session' ? sessionStorage : localStorage;
    }

    get isStateChaged() {
        return this.dt?.filteredValue || this.dt?.sortField || this.storage.getItem(this.stateKey + '-selectedColumns');
    }

    constructor(injector: Injector) {
        super(injector);
    }

    override ngOnInit(): void {
        super.ngOnInit();

        this.loadSelectedColumnState();
    }

    ngAfterViewInit(): void {
        this.columns.forEach(column => {
            column.template = this.templates.find((x: any) => x._declarationTContainer.localNames && x._declarationTContainer.localNames[0] == column.templateName);
            column.header = this.translateService.instant(column.header);
        })
    }

    saveSelectedColumnState() {
        this.storage.setItem(this.stateKey + '-selectedColumns', JSON.stringify(this.selectedColumns.map(x => x.field)));
    }

    loadSelectedColumnState() {
        const state = this.storage.getItem(this.stateKey + '-selectedColumns');
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
        storage.removeItem(this.stateKey + '-selectedColumns');
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
        // data آرایه آبجکت‌هاست
        const worksheet = XLSX.utils.json_to_sheet(this.value);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

        // تبدیل ورک‌بوک به باینری
        const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

        // ساخت Blob و دانلود فایل
        const blob = new Blob([wbout], { type: 'application/octet-stream' });
        saveAs(blob, this.router.url.replaceAll('/', '-') + `-${Date.now()}.xlsx`);
    }

    resetState() {
        this.dt.clearState();
        this.dt.reset();
        this.dt.restoreColumnOrder();
        this.resetSelectedColumnState();
        this.selectedColumns = this.columns.filter(x => !x.isHide);

    }

    filter(event: TableFilterEvent) {
        this.onFilter.emit(event);
    }
}
