import {Directive, HostBinding, HostListener, Input, OnInit} from "@angular/core";
import {TableService} from "../services/table.service";
import {SortFunc} from "../models";

@Directive({
  selector: 'th[sort-by]'
})
export class DataTableSortDirective implements OnInit {
  @Input('sort-by') field!: string | SortFunc;

  @HostBinding('class.sortable') sortable = true;
  @HostBinding('class') classes: string = '';

  @HostListener('click')
  onClick() {
    this.tableService.onSortChange.next(this.field);
  }

  constructor(private tableService: TableService) {
  }

  ngOnInit(): void {
    this.tableService.onSortChange.subscribe((field) => {
      const oldSortKey = this.tableService.config.sorting.field;
      if (field == this.field) {
        if (field == oldSortKey) {
          if(this.tableService.config.sorting.dir == 'asc') {
            this.tableService.config.sorting.dir = 'desc';
          } else {
            this.tableService.config.sorting.dir = 'asc';
          }
        } else {
          this.tableService.config.sorting.dir = 'desc';
        }
        this.classes = 'sort-dir ' + this.tableService.config.sorting.dir;
        this.tableService.config.sorting.field = field;
        this.tableService.dataTable.render();
      } else {
        this.classes = '';
      }
    });
  }
}
