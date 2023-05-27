import {Directive, Input, TemplateRef} from "@angular/core";
import {TemplateDirective as BaseTemplateDirective} from "../../template/template.directive";

@Directive({
  selector: '[dTemplate]'
})
export class TableTemplateDirective extends BaseTemplateDirective {
  @Input('dTemplate') override name!: 'caption' | 'header' | 'filter' | 'body' | 'detail' | 'footer' | 'summary' | string;
}
