import {Directive, Injector, TemplateRef} from '@angular/core';
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

    override showDialog(name: string, template: TemplateRef<any>, options?: DialogOptions) {
        options ??= {};
        options.title ??= (options.context ? this.t('edit') : this.t('add'));
        const dialog = super.showDialog(name, template, options);
        dialog.onClose.subscribe(() => {
            this.load();
        });
        return dialog;
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
