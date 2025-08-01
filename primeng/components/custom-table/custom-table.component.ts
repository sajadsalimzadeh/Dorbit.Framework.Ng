import {AfterViewInit, Component, ContentChild, ContentChildren, EventEmitter, Injector, Input, Output, QueryList, TemplateRef} from "@angular/core";
import {MenuItem} from "primeng/api";
import {CustomTableColumn} from "./contracts";
import {PrimengComponent} from "../primeng.component";

@Component({
    standalone: false,
    selector: 'p-custom-table',
    templateUrl: './custom-table.component.html',
    styleUrl: './custom-table.component.scss',
})

export class CustomTableComponent extends PrimengComponent implements AfterViewInit {
    @Input() value: any[] = [];
    @Input() size: 'small' | 'large' = 'small';
    @Input() loading: boolean = false;
    @Input() columns: CustomTableColumn[] = [];
    @Input() breadcrumb?: MenuItem[];
    @Input() showInCard: boolean = true;
    @Input() showColumnSelector: boolean = false;
    @Input() filterType: 'menu' | 'inline' = 'menu';
    @Input() isSortable: boolean = true;
    @Input() isFilterable: boolean = true;
    @Input() rows: number = 12;
    @Input() rowsPerPageOptions: number[] = [5, 10, 12, 15, 20, 50];
    @Input() headerClass?: string;
    @Input() rowClassField?: string;

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
}
