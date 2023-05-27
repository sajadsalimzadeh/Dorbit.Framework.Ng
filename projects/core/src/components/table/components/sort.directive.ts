import {Directive, HostBinding, HostListener, Input, OnInit} from "@angular/core";
import {TableService} from "../services/table.service";
import {SortDir, SortFunc} from "../models";

export interface SortEvent {
  field: string | SortFunc;
  dir: SortDir;
}

@Directive({
  selector: 'th[sort-by]'
})
export class TableSortDirective implements OnInit {
  @Input('sort-by') field?: string | SortFunc;

  @HostBinding('class.sortable') get sortable() {
    return !!this.field;
  };

  @HostBinding('class') classes: string = '';

  @HostListener('click')
  onClick() {
    if (this.field) {
      let dir: SortDir;
      if (this.tableService.config.sorting.field == this.field) {
        dir = (this.tableService.config.sorting.dir === 'asc' ? 'desc' : 'asc');
      } else dir = 'asc';
      this.tableService.onSortChange.next({field: this.field, dir: dir});
    }
  }

  constructor(private tableService: TableService) {
  }

  ngOnInit(): void {
    this.tableService.onSortChange.subscribe((e) => {
      if (e.field == this.field) {
        this.tableService.config.sorting.dir = e.dir;
        this.tableService.config.sorting.field = e.field;
        this.classes = (e.field ? 'sort-dir ' + e.dir : '');
        this.tableService.dataTable.render();
      } else {
        this.classes = '';
      }
    });
  }
}
