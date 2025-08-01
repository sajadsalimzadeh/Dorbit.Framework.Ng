import { AfterViewInit, Component, ContentChild, ContentChildren, EventEmitter, HostBinding, Injector, Input, Output, QueryList, TemplateRef } from "@angular/core";
import { MenuItem } from "primeng/api";
import { CustomTableColumn } from "./contracts";
import { PrimengComponent } from "../primeng.component";
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';

@Component({
    standalone: false,
    selector: 'p-custom-table',
    templateUrl: './custom-table.component.html',
    styleUrl: './custom-table.component.scss',
})

export class CustomTableComponent extends PrimengComponent implements AfterViewInit {
    @Input() value: any[] = [];
    @Input() loading: boolean = false;
    @Input() columns: CustomTableColumn[] = [];
    @Input() breadcrumb?: MenuItem[];
    @Input() showInCard: boolean = true;
    @Input() showColumnSelector: boolean = true;
    @Input() filterType: 'menu' | 'inline' = 'inline';
    @Input() isSortable: boolean = true;
    @Input() isFilterable: boolean = true;
    @Input() rows: number = 12;
    @Input() rowsPerPageOptions: number[] = [5, 10, 12, 15, 20, 50];
    @Input() headerClass?: string;
    @Input() rowClassField?: string;
    
    @Input() 
    @HostBinding('class') size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' = 'md';

    @Output() onAdd = new EventEmitter<any>();
    @Output() onEdit = new EventEmitter<any>();
    @Output() onDelete = new EventEmitter<any>();
    @Output() isSaving = new EventEmitter<any>();

    @ContentChild('caption') captionTpl?: TemplateRef<any>;
    @ContentChild('header') headerTpl?: TemplateRef<any>;
    @ContentChild('body') bodyTpl?: TemplateRef<any>;
    @ContentChild('expandedrow') expandedrowTpl?: TemplateRef<any>;
    @ContentChild('operation') operationTpl?: TemplateRef<any>;

    @ContentChildren(TemplateRef) templates!: QueryList<TemplateRef<any>>;

    isDeleteDialogVisible = false;
    selectedColumns: CustomTableColumn[] = [];

    constructor(injector: Injector) {
        super(injector);

    }

    override ngOnInit(): void {
        this.processHideColumns();
    }

    ngAfterViewInit(): void {
        this.columns.forEach(column => {
            column.template = this.templates.find((x: any) => x._declarationTContainer.localNames && x._declarationTContainer.localNames[0] == column.templateName);
            column.header = this.translateService.instant(column.header);

        })
    }

    processHideColumns() {
        this.selectedColumns = this.columns.filter(x => !x.isHide);
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

    saveState() {
        
    }
}
