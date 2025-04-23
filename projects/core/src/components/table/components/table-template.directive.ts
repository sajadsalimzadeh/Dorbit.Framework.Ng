import {Directive, Input} from "@angular/core";
import {TemplateDirective as BaseTemplateDirective} from "../../../directives/template.directive";

@Directive({
    selector: '[dTableTemplate]',
    standalone: false
})
export class TableTemplateDirective extends BaseTemplateDirective {
    @Input('dTableTemplate') set templateName(value: 'caption' | 'header' | 'filter' | 'body' | 'detail' | 'footer' | 'summary' | string) {
        this.name = value;
    }
}
