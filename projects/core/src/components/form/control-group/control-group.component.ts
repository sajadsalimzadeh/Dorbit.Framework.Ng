import {
  Component,
  ContentChildren, ElementRef, HostBinding, Injector,
  Input,
  QueryList,
  TemplateRef,
} from '@angular/core';
import {TemplateDirective} from "../../../directives/template/template.directive";
import {AbstractFormControl, createControlValueAccessor, ValidationError} from "../form-control.directive";
import {FormControlService} from "../form-control.service";
import {ControlGroupService} from "./control-group.service";

@Component({
  selector: 'd-control-group',
  templateUrl: 'control-group.component.html',
  styleUrls: ['./control-group.component.scss', '../control.scss'],
  providers: [createControlValueAccessor(ControlGroupComponent), FormControlService]
})
export class ControlGroupComponent extends AbstractFormControl<any> {
  @Input() label: string = '';
  @Input() labelState: 'floating' | 'fix' = 'fix';
  @Input() hint: string = '';

  controlEl!: ElementRef<HTMLInputElement>;

  errors: (ValidationError | any)[] = [];
  startTemplate?: TemplateRef<any>;
  endTemplate?: TemplateRef<any>;

  override onFocus(e: FocusEvent) {
    super.onFocus(e);
    e.stopPropagation();
  }

  @ContentChildren(TemplateDirective) set templates(value: QueryList<TemplateDirective>) {
    this.startTemplate = value.find(x => x.includesName('start'))?.template;
    this.endTemplate = value.find(x => x.includesName('end'))?.template;
  }

  constructor(injector: Injector, private controlGroupService: ControlGroupService) {
    super(injector);
  }

  override init() {

    if (this.formControlService) {
      this.formControlService.formControl = this.formControl;
      this.formControlService.size = this.size;
    }

    super.init();
  }

  override render() {
    super.render();

    this.errors = [];
    if (this.formControl?.errors) {
      for (const errorsKey in this.formControl.errors) {
        const error = this.formControl.errors[errorsKey];
        if (!error) continue;
        if (typeof error === 'object') {
          let message = (error.message ? error.message : this.controlGroupService.validationMessages[errorsKey])?.toString() ?? '';
          for (const key in error) {
            message = message.replace(`{${key}}`, error[key]);
          }
          if (message) {
            this.errors.push({
              type: errorsKey,
              message: message,
              order: error.order ?? 100,
            });
          }
        } else if (typeof error === 'boolean') {
          this.errors.push({
            type: errorsKey,
            message: this.controlGroupService.validationMessages[errorsKey],
            order: 100,
          });
        } else if (typeof error === 'string') {
          this.errors.push({
            type: errorsKey,
            message: error,
            order: 100,
          });
        }
      }
      this.errors = this.errors.sort((x1, x2) => (x1.order < x2.order ? -1 : (x1.order > x2.order ? 1 : 0)));
    }

    this.classes['float-label'] = (
      this.labelState == 'floating' &&
      (!this.focused && !this.formControl.value && this.formControl.value !== false)
    );
    this.classes['has-below-box'] = true;
  }
}
