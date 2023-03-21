import {Directive, Input, NgModule, TemplateRef} from "@angular/core";
import {CommonModule} from "@angular/common";


@Directive({
  selector: '[devTemplate]'
})
export class DevTemplateDirective {

  @Input('devTemplate') name?: string;

  constructor(public template: TemplateRef<any>) {
  }
}


@NgModule({
  imports: [CommonModule],
  declarations: [DevTemplateDirective],
  exports: [DevTemplateDirective],
})
export class DevTemplateModule {}
