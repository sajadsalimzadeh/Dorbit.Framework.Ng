import {
  ContentChildren,
  Directive, ElementRef,
  Input,
  OnInit, QueryList,
} from "@angular/core";
import {FormControl} from "@angular/forms";
import {TableService} from "../services/table.service";
import {TemplateDirective} from "../../../directives/template/template.directive";

type Operation = 'contains' | 'eq' | 'nq' | 'gt' | 'ge' | 'lt' | 'le' | 'in';

type Type = undefined | 'text' | 'select' | ''
interface SelectFilter {

}
interface DateFilter {

}

@Directive({
  selector: 'dev-columnFilter'
})
export class DataTableFilterDirective implements OnInit {
  @Input('field') name!: string;
  @Input('type') type?: Type;
  @Input('items') items?: any[];
  @Input('comparator') comparator?: (x: any) => boolean;
  @Input('operation') operation: Operation = 'contains';
  control = new FormControl(null);
  onChange?: () => void;

  @ContentChildren(TemplateDirective) set templates(value: QueryList<TemplateDirective>) {
  }


  constructor(private elementRef: ElementRef, private tableService: TableService) {

    let node = elementRef.nativeElement as HTMLElement
    let th: HTMLElement | undefined, tr: HTMLElement | undefined;
    while (node) {
      if (node.tagName.toLowerCase() == 'th') {
        th = node;
      }
      if(node.tagName.toLowerCase() == 'tr') {
        tr = node;
        break;
      }
      node = node.parentNode as HTMLElement;
    }
    if(tr) {
      const columns = Array.prototype.slice.call(tr.querySelectorAll('th'));
      const index = columns.indexOf(th);
      if(index > -1) {
        tableService.filters[index] = this;
      }
    }
  }

  ngOnInit(): void {
    this.control.valueChanges.subscribe(e => {
      if(this.onChange) this.onChange();
    })
  }
}
