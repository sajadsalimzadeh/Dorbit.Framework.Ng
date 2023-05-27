import {Directive, Input, NgModule, TemplateRef} from "@angular/core";
import {CommonModule} from "@angular/common";


@Directive({
  selector: '[dTemplate]'
})
export class TemplateDirective {

  @Input('dTemplate') name?: string = 'default';

  constructor(public template: TemplateRef<any>) {
  }

  includesName(value: string, isDefault = false) {
    if(isDefault && !this.name) return true;
    if(this.name?.includes(',')) {
      const splits = this.name.split(',');
      return splits.includes(value);
    }
    return value == this.name;
  }
}


@NgModule({
  imports: [CommonModule],
  declarations: [TemplateDirective],
  exports: [TemplateDirective],
})
export class TemplateModule {}
