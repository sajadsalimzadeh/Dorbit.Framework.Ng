import {Directive, Input, TemplateRef} from "@angular/core";
import {TemplateDirective} from "../../template/template.directive";

@Directive({
  selector: '[dTab]'
})
export class TabTemplateDirective extends TemplateDirective {
  @Input('dTab') key?: any;
  @Input() header?: string;
  @Input() icon?: string;
  @Input() class?: any;

  constructor(template: TemplateRef<any>) {
    super(template);
  }
}
