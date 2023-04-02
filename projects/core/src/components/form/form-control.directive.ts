import {
  ContentChildren,
  Directive, ElementRef, EventEmitter,
  forwardRef, HostBinding, HostListener,
  Injector, Input,
  OnChanges,
  OnDestroy,
  OnInit, Output, QueryList,
  SimpleChanges, TemplateRef,
  Type, ViewChild
} from "@angular/core";
import {ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, NgControl} from "@angular/forms";
import {TemplateDirective} from "../../directives/template/template.directive";
import {FormControlService} from "./form-control.service";
import {BaseComponent} from "../base.component";

export function createControlValueAccessor(type: Type<any>) {
  return {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => type),
    multi: true
  };
}

export interface ValidationError {
  type: string;
  message: string;
}

let tabIndex = 0;

@Directive()
export abstract class AbstractFormControl<T> extends BaseComponent implements ControlValueAccessor, OnInit, OnChanges, OnDestroy {
  @Input() placeholder: string = '';
  @Input() @HostBinding('tabIndex') tabIndex: number | undefined = tabIndex++;

  @Output() onChange = new EventEmitter<T>();

  @HostListener('focus', ['$event'])
  onFocus(e: FocusEvent) {
    this.focused = true;
    this.render();
  }

  @HostListener('blur', ['$event'])
  onBlur(_: FocusEvent) {
    this.focused = false;
    this.render();
  }

  @HostListener('click', ['$event'])
  onClick(e: MouseEvent) {
    this.inputEl?.nativeElement.focus();
  }

  @ViewChild('inputEl') inputEl?: ElementRef<HTMLInputElement>;

  validationsTemplate?: TemplateRef<any>;

  @ContentChildren(TemplateDirective)
  private set _templates(value: QueryList<TemplateDirective>) {
    this.validationsTemplate = value.find(x => x.includesName('validation'))?.template;
  }

  focused: boolean = false;

  formControl!: FormControl<T>;
  protected ngControl?: NgControl | null;

  protected _onChange: any;
  protected _touch: any;

  protected formControlService: FormControlService | null;

  constructor(injector: Injector) {
    super(injector);
    this.formControlService = injector.get(FormControlService, null, {optional: true});
    if (this.formControlService) {
      this.size = this.formControlService.size ?? 'md';
    }
  }

  override ngOnInit(): void {
    this.init();
    this.render();
  }

  override ngOnChanges(changes: SimpleChanges): void {
    if (!this.formControl) return;
    this.render();
  }

  init() {
    this.ngControl = this.injector.get(NgControl, undefined, {optional: true});
    const fcs = this.formControlService;
    this.formControl = (this.ngControl?.control ?? fcs?.formControl ?? new FormControl) as FormControl;
    this.size = (fcs?.size ?? this.size);

    //============== Listener ===============\\
    let value: any;
    this.subscription.add(this.formControl.valueChanges.subscribe((e) => {
      if (value === e) return;
      value = e;
      this.render();
      this.onChange.emit(e);
    }));
  }

  registerOnChange(fn: any): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this._touch = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    if (this.formControl) {
      if (isDisabled) {
        if (!this.formControl.enabled) this.formControl.disable();
      } else {
        if (this.formControl.disabled) this.formControl.enable();
      }
    }
  }

  writeValue(value: T): void {
    if (this.formControl.value !== value) {
      this.formControl.setValue(value);
    }
  }

  override render() {
    super.render();
    this.classes['focused'] = this.focused;
  }

  focus() {
    const evt = document.createEvent("FocusEvent");
    evt.initEvent("focus", true, true);
    this.elementRef.nativeElement.dispatchEvent(evt);
  }

  blur() {
    const evt = document.createEvent("FocusEvent");
    evt.initEvent("blur", true, true);
    this.elementRef.nativeElement.dispatchEvent(evt);
  }
}
