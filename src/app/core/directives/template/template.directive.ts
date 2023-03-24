import {Directive, Input, NgModule, TemplateRef} from "@angular/core";
import {CommonModule} from "@angular/common";


@Directive({
  selector: '[dTemplate]'
})
export class TemplateDirective {

  @Input('dTemplate') name?: string;

  constructor(public template: TemplateRef<any>) {
  }
}


@NgModule({
  imports: [CommonModule],
  declarations: [TemplateDirective],
  exports: [TemplateDirective],
})
export class DevTemplateModule {}
