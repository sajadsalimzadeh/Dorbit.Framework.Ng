import {PrimengComponent} from './primeng.component';
import {Directive, Injector} from '@angular/core';
import {QueryResult} from "@framework/contracts/results";
import {Observable} from 'rxjs';
import {CustomTableColumn} from '@primeng/components/custom-table/contracts';
import { ODataQueryOptions } from '@framework/contracts';

@Directive()
export abstract class PrimengTableComponent<T = any> extends PrimengComponent {
    items: T[] = [];
    abstract columns: CustomTableColumn<T>[];

    constructor(injector: Injector) {
        super(injector);
    }

    override ngOnInit() {
        super.ngOnInit();

        this.load();
    }

    abstract loader(query?: ODataQueryOptions): Observable<QueryResult<T[]>>;

    load() {
        const query = new ODataQueryOptions();
        
        this.loader(query).subscribe((res) => {
            this.items = res.data ?? [];
            this.onLoad();
        });
    }

    onLoad() {

    }
}
