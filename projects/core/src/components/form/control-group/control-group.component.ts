import {
  Component,
  ContentChildren, ElementRef, Injector,
  Input,
  QueryList,
  TemplateRef,
} from '@angular/core';
import {TemplateDirective} from "../../../directives";
import {AbstractFormControl, createControlValueAccessor, ValidationError} from "../form-control.directive";
import {FormControlService} from "../form-control.service";
import {ControlGroupService} from "./control-group.service";
import {FormControl} from "@angular/forms";

@Component({
  selector: 'd-control-group',
  templateUrl: 'control-group.component.html',
  styleUrls: ['../control.scss', './control-group.component.scss'],
  providers: [createControlValueAccessor(ControlGroupComponent), FormControlService]
})
export class ControlGroupComponent extends AbstractFormControl<any> {
  @Input() label: string = '';
  @Input() labelMode: 'floating' | 'fix' = 'fix';
  @Input() hint: string = '';

  controlEl!: ElementRef<HTMLInputElement>;

  errors: (ValidationError | any)[] = [];
  startTemplate?: TemplateRef<any>;
  endTemplate?: TemplateRef<any>;
  labelTemplate?: TemplateRef<any>;

  @ContentChildren(TemplateDirective) set templates(value: QueryList<TemplateDirective>) {
    this.startTemplate = value.find(x => x.includesName('start'))?.template;
    this.endTemplate = value.find(x => x.includesName('end'))?.template;
    this.labelTemplate = value.find(x => x.includesName('label'))?.template;
  }

  override onFocus(e: FocusEvent) {
    super.onFocus(e);
    e.stopPropagation();
  }

  constructor(injector: Injector, private controlGroupService: ControlGroupService) {
    super(injector);
  }

  override init() {
    super.init();
    if (this.formControlService) {
      if(this.ngControl?.control) {
        this.formControlService.formControl = this.formControl;
      }
      this.formControlService.size = this.size;
    }
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
      this.labelMode == 'floating' &&
      (!this.focused && !this.formControl.value && this.formControl.value !== false)
    );
    this.classes['has-below-box'] = true;
  }
}
