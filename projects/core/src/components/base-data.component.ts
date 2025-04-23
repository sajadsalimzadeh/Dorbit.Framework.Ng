import {Directive, Injector} from '@angular/core';
import {BaseWriteRepository} from "../repositories/base-write.repository";
import {ODataQueryOptions} from '../contracts/odata-query-options';
import {BaseDataViewComponent} from "./base-data-view.component";
import {Observable} from "rxjs";
import {PagedListResult} from "../contracts/command-result";

@Directive()
export abstract class BaseDataComponent extends BaseDataViewComponent {

    constructor(injector: Injector, protected repository: BaseWriteRepository) {
        super(injector);
    }

    remove(item: any, title?: string, body?: string) {
        const dialog = this.dialogService.confirmYesNo(() => {
            dialog.loading = true;
            this.repository.remove(item.id).subscribe({
                next: () => {
                    dialog.loading = false;
                    this.load();
                    dialog.close();
                },
                error: () => {
                    dialog.loading = false;
                }
            });
        }, undefined, {
            title: title ?? 'حذف',
            body: body ?? 'آیا از حذف مورد انتخاب شده اطمینان دارید؟'
        })
    }

    protected override loader(query: ODataQueryOptions): Observable<PagedListResult> {
        return this.repository.select(query);
    }
}
