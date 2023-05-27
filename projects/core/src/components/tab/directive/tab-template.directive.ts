import {Directive, Input, TemplateRef} from "@angular/core";
import {TemplateDirective} from "../../template/template.directive";

@Directive({
  selector: '[dTemplate]'
})
export class TabTemplateDirective extends TemplateDirective {
  @Input() key?: string;
  @Input() header?: string;
  @Input() icon?: string;

  constructor(template: TemplateRef<any>) {
    super(template);
  }
}
