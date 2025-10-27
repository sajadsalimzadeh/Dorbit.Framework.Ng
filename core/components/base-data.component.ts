import {Directive, Injector} from '@angular/core';
import {BaseCrudRepository} from "../repositories/base-crud.repository";
import {ODataQueryOptions} from '../contracts/odata-query-options';
import {BaseDataViewComponent} from "./base-data-view.component";
import {Observable} from "rxjs";
import {PagedListResult} from "../contracts/results";

@Directive()
export abstract class BaseDataComponent extends BaseDataViewComponent {

    constructor(injector: Injector, protected repository: BaseCrudRepository) {
        super(injector);
    }

    remove(item: any, title?: string, body?: string) {
        const dialog = this.dialogService.confirmYesNo(() => {
            dialog.loading = true;
            this.repository.delete(item.id).subscribe({
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
            title: title ?? this.t('delete'),
            body: body ?? this.t('delete-confirm')
        })
    }

    protected override loader(query: ODataQueryOptions): Observable<PagedListResult> {
        return this.repository.select(query);
    }
}
