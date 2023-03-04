import {
  Component,
  ContentChildren, ElementRef, Injector,
  Input,
  QueryList,
  TemplateRef
} from '@angular/core';
import {DevTemplateDirective} from "../../../directives/template/dev-template.directive";
import {AbstractFormControl, createControlValueAccessor} from "../form-control.directive";
import {FormControlService} from "../form-control.service";

@Component({
  selector: 'dev-control-group',
  templateUrl: 'control-group.component.html',
  styleUrls: ['./control-group.component.scss', '../control-box.scss'],
  providers: [createControlValueAccessor(ControlGroupComponent), FormControlService]
})
export class ControlGroupComponent extends AbstractFormControl<any> {
  @Input() label: string = '';
  @Input() labelState: 'floating' | 'fix' = 'fix';

  controlEl!: ElementRef<HTMLInputElement>;

  startTemplate?: TemplateRef<any>;
  endTemplate?: TemplateRef<any>;

  override onFocus(e: FocusEvent) {
    super.onFocus(e);
    e.stopPropagation();
  }

  @ContentChildren(DevTemplateDirective) set templates(value: QueryList<DevTemplateDirective>) {
    this.startTemplate = value.find(x => x.name == 'start')?.template;
    this.endTemplate = value.find(x => x.name == 'end')?.template;
  }

  constructor(injector: Injector) {
    super(injector);
  }

  override render() {
    super.render();
    this.classes['float-label'] = (this.labelState == 'floating' &&
      (!this.focused && !this.formControl.value && this.formControl.value !== false)
    );
  }
}
