import {Directive, Input} from '@angular/core';
import {TemplateDirective} from "../../template/template.directive";

@Directive({selector: '[dStep]'})
export class StepDirective extends TemplateDirective{
  @Input({alias: 'dStep', required: true}) key!: string;
  @Input() text?: string;
  @Input() icon?: string;
  @Input() image?: string;

}
