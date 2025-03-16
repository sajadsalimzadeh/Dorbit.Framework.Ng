import {Directive, EventEmitter, Injector, Input, Output, Type} from '@angular/core';
import {BasePanelComponent} from "./base-panel.component";
import {FormGroup} from "@angular/forms";
import {ISaveRepository} from "@framework";

@Directive()
export abstract class BaseFormComponent extends BasePanelComponent {
  @Input({required: true}) model: any;

  @Output() onComplete = new EventEmitter<any>();

  protected abstract form: FormGroup;

  constructor(injector: Injector, protected repository: ISaveRepository) {
    super(injector);
  }

  override ngOnInit() {
    super.ngOnInit();

    if (this.model) {
      this.form.patchValue(this.model);
      this.form.get('id')?.enable();
    } else {
      this.form.get('id')?.disable();
    }
  }

  beforeSubmit(value: any): void {
  }


  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      const firstFocusEl = this.elementRef.nativeElement.querySelector('form .ng-invalid[tabindex], form .ng-invalid [tabindex]') as HTMLElement;
      if (firstFocusEl) firstFocusEl.focus()
      this.form.markAsDirty()
      this.messageService.warn('مقادیر وارد شده صحیح نمیباشد')
      return;
    }
    let value = this.form.getRawValue();
    this.beforeSubmit(value);
    value = {...this.model, ...value} as any;
    if (this.model) {
      value.id = this.model.id;
    } else {
      if(!value.id) delete value.id;
    }
    this.subscription.add(this.repository.save(this.model?.id, value).subscribe(res => {
      this.onComplete.emit(res.data);
      this.dialog?.close();
    }));
  }
}
