import {Directive, ElementRef, HostBinding, HostListener, Input, OnInit} from "@angular/core";
import {TableService} from "../services/table.service";
import {SortDir, SortFunc} from "../models";
import {Subscription} from "rxjs";

export interface SortEvent {
  field: string | SortFunc;
  dir: SortDir;
}

@Directive({
    selector: 'th[field], th[sort-by]',
    standalone: false
})
export class TableSortDirective implements OnInit {
  @Input() field?: string | SortFunc;

  @Input('sort-by') set sortBy(value: string | SortFunc) {
    this.field = value;
  }

  subscription = new Subscription();

  @HostBinding('class.sortable') get sortable() {
    return !!this.field;
  };

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

  constructor(private tableService: TableService, private elementRef: ElementRef) {
  }

  ngOnInit(): void {
    let el = this.elementRef.nativeElement as HTMLElement;
    const iconEl = document.createElement('i');
    iconEl.className = 'sort-icon fal fa-sort';
    const div = el.querySelector('.filter-box') as HTMLElement;
    if (div) {
      const filterEl = el.querySelector('.filter') as HTMLElement;
      if (filterEl) div.insertBefore(iconEl, filterEl)
      else div.appendChild(iconEl);
    } else {
      el.appendChild(iconEl);
    }
    this.subscription.add(this.tableService.onSortChange.subscribe((e) => {
      if (e.field == this.field) {
        this.tableService.config.sorting.dir = e.dir;
        this.tableService.config.sorting.field = e.field;
        iconEl.className = `sort-icon fad fa-${(e.dir == 'asc' ? 'sort-up' : 'sort-down')}`
        this.tableService.dataTable.render();
      } else {
        iconEl.className = `sort-icon fal fa-sort`;
      }
    }));
  }
}
