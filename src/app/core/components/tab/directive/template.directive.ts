import {Directive, Input, TemplateRef} from "@angular/core";
import {DevTemplateDirective} from "../../../directives/template/dev-template.directive";

@Directive({
  selector: '[devTemplate]'
})
export class TemplateDirective extends DevTemplateDirective {
  @Input() header?: string;

  constructor(template: TemplateRef<any>) {
    super(template);
  }
}
