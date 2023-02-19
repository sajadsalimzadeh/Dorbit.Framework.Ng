import {Directive, ElementRef, Input, TemplateRef,} from "@angular/core";
import {FormControl} from "@angular/forms";
import {TableService} from "../services/table.service";
import {TemplateDirective} from "../../../directives/template/template.directive";

@Directive({
  selector: '[devTemplate="filter"]'
})
export class DataTableFilterDirective extends TemplateDirective {
  control = new FormControl(null);
  onChange?: () => void;

  constructor(template: TemplateRef<any>, private elementRef: ElementRef, private tableService: TableService) {
    super(template)
  }

  ngOnInit(): void {
    this.control.valueChanges.subscribe(e => {
      if (this.onChange) this.onChange();
    })
  }
}
