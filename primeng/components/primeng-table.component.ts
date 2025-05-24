import {PrimengComponent} from '@primeng';
import {Directive, Injector} from '@angular/core';
import {IViewRepository} from "@framework";

@Directive()
export class PrimengTableComponent<T = any> extends PrimengComponent {
    items: T[] = [];

    constructor(injector: Injector, protected repository: IViewRepository<T>) {
        super(injector);
    }

    override ngOnInit() {
        super.ngOnInit();

        this.load();
    }

    load() {
        this.repository.getAll().subscribe((res) => this.items = res.data ?? []);
    }

}
