import {PrimengComponent} from '@primeng';
import {Directive, Injector} from '@angular/core';
import {QueryResult} from "@framework";
import {Observable} from 'rxjs';

@Directive()
export abstract class PrimengTableComponent<T = any> extends PrimengComponent {
    items: T[] = [];

    constructor(injector: Injector) {
        super(injector);
    }

    override ngOnInit() {
        super.ngOnInit();

        this.load();
    }

    abstract loader(): Observable<QueryResult<T[]>>;

    load() {
        this.loader().subscribe((res) => this.items = res.data ?? []);
    }

}
