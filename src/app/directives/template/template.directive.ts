import {Directive, Input, NgModule, TemplateRef} from "@angular/core";
import {CommonModule} from "@angular/common";


@Directive({
  selector: '[devTemplate]'
})
export class TemplateDirective {

  @Input('devTemplate') name?: string;

  constructor(public template: TemplateRef<any>) {
  }
}


@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [TemplateDirective],
  exports: [TemplateDirective],
})
export class TemplateModule {}
