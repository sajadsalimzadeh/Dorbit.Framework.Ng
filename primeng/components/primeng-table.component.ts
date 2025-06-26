import {PrimengComponent} from './primeng.component';
import {Directive, Injector} from '@angular/core';
import {QueryResult} from "@framework/contracts/results";
import {Observable} from 'rxjs';
import {CustomTableColumn} from '@primeng/components/custom-table/contracts';

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

    abstract loader(): Observable<QueryResult<T[]>>;

    load() {
        this.loader().subscribe((res) => {
            this.items = res.data ?? [];
            this.onLoad();
        });
    }

    onLoad() {

    }
}
