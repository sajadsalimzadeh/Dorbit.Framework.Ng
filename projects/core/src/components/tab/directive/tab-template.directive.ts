import {Directive, Input, TemplateRef} from "@angular/core";
import {TemplateDirective as BaseTemplateDirective} from "../../../directives/template/template.directive";

@Directive({
  selector: '[dTemplate]'
})
export class TabTemplateDirective extends BaseTemplateDirective {
  @Input() header?: string;
  @Input() icon?: string;

  constructor(template: TemplateRef<any>) {
    super(template);
  }
}
