import {
  ContentChildren,
  Directive,
  ElementRef,
  EventEmitter,
  forwardRef,
  HostBinding,
  HostListener,
  Injector,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  QueryList,
  SimpleChanges,
  TemplateRef,
  Type,
  ViewChild
} from "@angular/core";
import {ControlContainer, ControlValueAccessor, FormControl, FormGroupDirective, NG_VALUE_ACCESSOR, NgControl} from "@angular/forms";
import {TemplateDirective} from "../template/template.directive";
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
  @Input() name: string = '';
  @Input() placeholder: string = '';
  @Input() @HostBinding('tabIndex') tabIndex: number | undefined = tabIndex++;
  @Input() formControl!: FormControl<any>;
  @Input() formControlName?: string;
  @Input() classControl?: any;
  @Input() styleControl?: any;

  private _autofocus: boolean = false;
  @Input() set autofocus(value: { delay: number } | boolean | undefined) {
    this._autofocus = (typeof value === 'boolean' ? value : true);
    const delay = (typeof value === 'object' ? value.delay : 10) ?? 10;
    setTimeout(() => {
      this.inputEl?.nativeElement.setAttribute('autofocus', 'autofocus');
      this.inputEl?.nativeElement.focus();

      setTimeout(() => {
        this.inputEl?.nativeElement.removeAttribute('autofocus');
      })
    }, delay);
  }

  get autofocus() {
    return this._autofocus;
  }

  @Output() onChange = new EventEmitter<T>();
  @Output() onKeydown = new EventEmitter<KeyboardEvent>();
  @Output() onKeyup = new EventEmitter<KeyboardEvent>();

  @HostListener('focus', ['$event'])
  onFocus(e: FocusEvent) {
    this.focused = true;
    this.render();
  }

  @HostListener('blur', ['$event'])
  onBlur(_: FocusEvent) {
    this.focused = false;
    this.formControl?.markAsTouched();
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

  protected _touch: any;
  protected _onChange: any;
  protected ngControl?: NgControl | null;
  protected controlContainer?: ControlContainer | null;
  protected formControlService: FormControlService | null;

  focused: boolean = false;

  constructor(injector: Injector) {
    super(injector);
    this.formControlService = injector.get(FormControlService, null, {optional: true});
    if (this.formControlService) {
      this.size = this.formControlService.size ?? 'md';
    }
  }

  override ngOnInit(): void {
    super.ngOnInit();

    this.init();
    this.render();
  }

  override ngOnChanges(changes: SimpleChanges): void {
    if (!this.formControl) return;
    this.render();
  }

  init() {
    this.ngControl = this.injector.get(NgControl, undefined, {optional: true});
    this.controlContainer = this.injector.get(ControlContainer, undefined, {optional: true});

    if (this.formControlName && this.controlContainer instanceof FormGroupDirective) {
      this.formControl = this.controlContainer.form.get(this.formControlName) as FormControl;
    }
    if (!this.formControl) this.formControl = this.ngControl?.control as FormControl;
    if (!this.formControl && this.formControlService?.formControl) this.formControl = this.formControlService.formControl;
    if (!this.formControl) this.formControl = new FormControl();

    this.size = this.formControlService?.size ?? this.size;

    //============== Listener ===============\\
    let value: any;
    this.subscription.add(this.formControl.valueChanges.subscribe((e: any) => {
      if (value === e) return;
      value = e;
      this.render();
      this.onChange.emit(e);
      this.formControl?.markAsDirty();
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
    if (this.formControl?.value !== value) {
      this.formControl?.setValue(value);
    }
  }

  override render() {
    super.render();
    this.setClass('focused', this.focused);
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
