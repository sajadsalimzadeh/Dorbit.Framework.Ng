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
import {Subscription} from "rxjs";
import {DevTemplateDirective} from "../../directives/template/dev-template.directive";
import {FormControlService} from "./form-control.service";

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

export type Sizes = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

let tabIndex = 0;

@Directive()
export abstract class AbstractFormControl<T> implements ControlValueAccessor, OnInit, OnChanges, OnDestroy {
  @Input() size: Sizes = 'md';
  @Input() placeholder: string = '';
  @Input() @HostBinding('tabIndex') tabIndex: number | undefined = tabIndex++;
  @Input() status: 'primary' | 'secondary' | 'warning' | 'success' | 'danger' | 'link' = 'primary';

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

  @ContentChildren(DevTemplateDirective)
  private set _templates(value: QueryList<DevTemplateDirective>) {
    this.validationsTemplate = value.find(x => x.name == 'validation')?.template;
  }

  @HostBinding('class')
  classes: any = {};
  focused: boolean = false;

  formControl!: FormControl<T>;
  errors: (ValidationError | any)[] = [];

  protected _onChange: any;
  protected _touch: any;
  protected subscription = new Subscription();

  protected elementRef: ElementRef<HTMLElement>;
  protected formControlService: FormControlService | null;

  constructor(protected injector: Injector) {
    this.elementRef = injector.get(ElementRef);
    this.formControlService = injector.get(FormControlService, null, {optional: true});
    if (this.formControlService) {
      this.size = this.formControlService.size ?? 'md';
    }
  }

  ngOnInit(): void {
    this.init();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.init();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  init() {
    if (this.formControl) return;
    const control = this.injector.get(NgControl, undefined, {optional: true});
    if (control?.control) {
      this.formControl = (control.control as FormControl);
    }
    if (this.formControlService) {
      if (this.formControlService.size) {
        this.size = this.formControlService.size;
      }
      if (this.formControlService.formControl) {
        this.formControl = this.formControlService.formControl;
      }
    }
    if (!this.formControl) {
      this.formControl = new FormControl<any>(null);
    }
    let value: any;
    this.subscription.add(this.formControl.valueChanges.subscribe((e) => {
      if (value === e) return;
      value = e;
      this.render();
      this.onChange.emit(e);
    }));
    this.render();
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

  render() {
    this.classes = {};
    this.classes[this.size] = true;
    this.classes[this.status] = true;
    this.classes['focused'] = this.focused;
    if (this.formControl?.errors) {
      this.errors = [];
      for (const errorsKey in this.formControl.errors) {
        const error = this.formControl.errors[errorsKey];
        this.errors.push({
          type: errorsKey,
          ...error
        });
      }
    }

    this.elementRef.nativeElement.style.setProperty('--color-component', `var(--color-${this.status})`)
    this.elementRef.nativeElement.style.setProperty('--color-component-rgb', `var(--color-${this.status}-rgb)`)
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
