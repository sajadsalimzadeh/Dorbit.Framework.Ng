import {Component, HostBinding, HostListener, Input} from "@angular/core";
import {TableService} from "../../services/table.service";


@Component({
    selector: 'd-table-row-expander',
    templateUrl: './row-expander.component.html',
    styleUrls: ['./row-expander.component.scss'],
    standalone: false
})
export class TableRowExpanderComponent {
    @Input() item: any;
    @Input() mode: 'single' | 'multiple' = 'single';

    constructor(private tableService: TableService) {

    }

    @HostBinding('class.expanded')
    get expanded() {
        return !!this.item['rowExpanded'];
    }

    @HostListener('click', ['$event'])
    onClick(e: Event) {
        e.stopPropagation();
        this.toggle();
    }

    toggle() {
        if (this.mode == 'single') {
            this.tableService.dataTable.data.items
                .filter(x => x['rowExpanded'] && x != this.item)
                .forEach(x => x['rowExpanded'] = false);
        }
        this.item['rowExpanded'] = !this.item['rowExpanded'];
    }
}
