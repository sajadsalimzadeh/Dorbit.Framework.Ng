import {
  Component,
  ContentChildren,
  ElementRef,
  HostListener,
  Injector,
  Input,
  QueryList,
  TemplateRef,
} from '@angular/core';
import {TemplateDirective} from "../../template/template.directive";
import {AbstractFormControl, createControlValueAccessor, ValidationError} from "../form-control.directive";
import {FormControlService} from "../form-control.service";
import {ControlGroupValidationService} from "./control-group-validation.service";
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

  errors: (ValidationError | any)[] = [];
  prependTemplate?: TemplateRef<any>;
  appendTemplate?: TemplateRef<any>;
  labelTemplate?: TemplateRef<any>;

  @ContentChildren(TemplateDirective) set templates(value: QueryList<TemplateDirective>) {
    this.prependTemplate = value.find(x => x.includesName('prepend'))?.template;
    this.appendTemplate = value.find(x => x.includesName('append'))?.template;
    this.labelTemplate = value.find(x => x.includesName('label'))?.template;
  }

  @HostListener('click', ['$event'])
  override onClick(e: MouseEvent) {
    super.onClick(e);
    const control = this.elementRef.nativeElement.querySelector('.control') as HTMLElement;
    control?.focus();
  }

  override onFocus(e: FocusEvent) {
    super.onFocus(e);
    e.stopPropagation();
  }

  constructor(injector: Injector, private controlGroupValidationService: ControlGroupValidationService) {
    super(injector);
  }

  override init() {
    super.init();

    const formControlService = this.injector.get(FormControlService, null, {optional: true});
    if (formControlService) {
      formControlService.formControl = this.formControl;
      formControlService.size = this.size;
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
          let message = (error.message ? error.message : this.controlGroupValidationService.getMessage(errorsKey))?.toString() ?? '';
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
            message: this.controlGroupValidationService.getMessage(errorsKey),
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

    this.setClass('float-label', (
      this.labelMode == 'floating' &&
      (!this.focused && !this.formControl.value && this.formControl.value !== false)
    ));
    this.setClass('has-below-box');
  }
}
