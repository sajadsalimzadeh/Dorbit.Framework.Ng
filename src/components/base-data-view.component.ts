import {Directive, Injector, TemplateRef, Type} from '@angular/core';
import {ODataQueryOptions} from "../contracts/odata-query-options";
import {TableConfig, TableData} from './table/models';
import {DialogOptions} from './dialog/components/dialog/dialog.component';
import {Observable, Subscription} from "rxjs";
import {PagedListResult} from "../contracts/results";
import {BaseComponent} from './base.component';

@Directive()
export abstract class BaseDataViewComponent<T = any> extends BaseComponent {
    data: TableData<T> = {items: [], totalCount: 0};
    config = new TableConfig();

    loadSubscription = new Subscription();

    constructor(injector: Injector) {
        super(injector);
    }

    override ngOnInit() {
        super.ngOnInit();

        this.load();
    }

    override ngOnDestroy() {
        super.ngOnDestroy();

        this.loadSubscription.unsubscribe();
    }

    override showDialog(template: TemplateRef<any>, options?: DialogOptions) {
        if (this.dialog) return this.dialog;
        options ??= {};
        options.title ??= (options.context ? this.t('edit') : this.t('add'));
        this.dialog = super.showDialog(template, options);
        this.dialog?.onClose.subscribe(() => {
            this.dialog = undefined;
            this.load();
        });
        return this.dialog;
    }

    showDialogByComponent(component: Type<any>, context: any, options?: DialogOptions) {
        return this.dialogService.open({
            ...options,
            context: context,
            component: component
        })
    }

    protected abstract loader(query?: ODataQueryOptions): Observable<PagedListResult>;

    protected load() {
        this.loadSubscription.unsubscribe();
        this.loadSubscription = this.loader(new ODataQueryOptions()).subscribe(res => {
            this.data = {
                items: res.data ?? [],
                totalCount: res.totalCount ?? res.data?.length ?? 0,
            }
        })
    }
}
