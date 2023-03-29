import {Directive, HostBinding, HostListener, Input, OnInit} from "@angular/core";
import {TableService} from "../services/table.service";
import {SortFunc} from "../models";

export interface SortEvent {
  field: string | SortFunc;
  keepDirection?: boolean;
}

@Directive({
  selector: 'th[sort-by]'
})
export class DataTableSortDirective implements OnInit {
  @Input('sort-by') field!: string | SortFunc;

  @HostBinding('class.sortable') sortable = true;
  @HostBinding('class') classes: string = '';

  @HostListener('click')
  onClick() {
    this.tableService.onSortChange.next({field: this.field});
  }

  constructor(private tableService: TableService) {
  }

  ngOnInit(): void {
    this.tableService.onSortChange.subscribe((e) => {
      const oldSortKey = this.tableService.config.sorting.field;
      if (e.field == this.field) {
        if (!e.keepDirection) {
          if (e.field == oldSortKey) {
            if (this.tableService.config.sorting.dir == 'asc') {
              this.tableService.config.sorting.dir = 'desc';
            } else {
              e.field = '';
            }
          } else {
            this.tableService.config.sorting.dir = 'asc';
          }
        }
        this.tableService.config.sorting.field = e.field;
        this.classes = (e.field ? 'sort-dir ' + this.tableService.config.sorting.dir : '');
        this.tableService.dataTable.render();
      } else {
        this.classes = '';
      }
    });
  }
}
