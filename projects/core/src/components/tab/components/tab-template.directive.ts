import {Directive, Input, TemplateRef} from "@angular/core";
import {TemplateDirective} from "../../template/template.directive";

@Directive({
  selector: '[dTab]'
})
export class TabTemplateDirective extends TemplateDirective {
  @Input('dTab') key?: any;
  @Input() header?: string;
  @Input() icon?: string;
  @Input() classes?: any;
  @Input() noContent?: boolean;

  constructor(template: TemplateRef<any>) {
    super(template);
  }
}
