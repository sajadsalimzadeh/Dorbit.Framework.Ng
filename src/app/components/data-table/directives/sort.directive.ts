import {Directive, HostListener, Input} from "@angular/core";

@Directive({
  selector: 'th[sort]'
})
export class DataTableSortDirective {
  @Input('sort') field?: string | ((x1: any, x2: any) => number);

  @HostListener('click')
  onClick() {
    if(this.onSort) {
      this.onSort();
    }
  }

  onSort?: () => void;
}
