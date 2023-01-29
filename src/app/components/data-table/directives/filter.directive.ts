import {
  ContentChildren,
  Directive,
  HostListener,
  Input,
  OnChanges,
  OnInit,
  QueryList,
  SimpleChanges, TemplateRef
} from "@angular/core";
import {SortFunc} from "../models";
import {TemplateDirective} from "../../../directives/template/index.directive";
import {FormControl} from "@angular/forms";

type Operation = 'contains' | 'eq' | 'nq' | 'gt' | 'ge' | 'lt' | 'le' | 'in';

@Directive({
  selector: 'th[filter]'
})
export class DataTableFilterDirective implements OnInit {
  @Input('filter') name!: string;
  @Input('filterComparator') comparator?: (x: any) => boolean;
  @Input('filterOperation') operation: Operation = 'contains';
  control = new FormControl(null);
  onChange?: () => void;

  ngOnInit(): void {
    this.control.valueChanges.subscribe(e => {
      if(this.onChange) this.onChange();
    })
  }
}
