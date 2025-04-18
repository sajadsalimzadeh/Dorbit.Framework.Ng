import {Directive, Input} from '@angular/core';
import {TemplateDirective} from "../../../directives/template/template.directive";

@Directive({
    selector: '[dStep]',
    standalone: true
})
export class StepperStepDirective extends TemplateDirective{
  @Input({alias: 'dStep', required: true}) key!: string;
  @Input() text?: string;
  @Input() icon?: string;
  @Input() image?: string;

}
