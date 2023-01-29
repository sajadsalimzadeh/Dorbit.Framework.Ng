import {Directive, forwardRef, Injector, OnInit, Optional, Type} from "@angular/core";
import {AbstractControl, ControlValueAccessor, NG_VALUE_ACCESSOR, NgControl} from "@angular/forms";

export function CreateControlValueAccessor(type: Type<any>) {
  return {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => type),
    multi: true
  };
}

@Directive()
export abstract class AbstractFormControl<T> implements ControlValueAccessor, OnInit {
  control?: NgControl;
  formControl?: AbstractControl;

  innerValue?: T;

  protected _change: any;
  protected _touch: any;

  constructor(protected injector: Injector) {

  }

  ngOnInit(): void {

  }

  registerOnChange(fn: any): void {
    this._change = fn;
    this.control = this.injector.get(NgControl);
    this.formControl = this.control?.control ?? undefined;
  }

  registerOnTouched(fn: any): void {
    this._touch = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    if(isDisabled) this.formControl?.disable();
    else this.formControl?.enable();
  }

  writeValue(value: T): void {
    this.innerValue = value;
    this.render();
  }

  abstract render(): void;
}
