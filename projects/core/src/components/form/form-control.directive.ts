import {
  ContentChildren,
  Directive,
  ElementRef,
  EventEmitter,
  forwardRef,
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
import {
  ControlContainer,
  ControlValueAccessor,
  FormControl,
  FormControlName,
  FormGroup,
  NG_VALUE_ACCESSOR,
  NgControl,
  Validators
} from "@angular/forms";
import {TemplateDirective} from "../template/template.directive";
import {FormControlService} from "./form-control.service";
import {AbstractComponent} from "../abstract.component";

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

@Directive()
export abstract class AbstractFormControl<T> extends AbstractComponent implements ControlValueAccessor, OnInit, OnChanges, OnDestroy {
  private _autofocus: boolean = false;

  @Input() name: string = '';
  @Input() placeholder: string = '';
  @Input() formControl!: FormControl<any>;
  @Input() classControl?: any;
  @Input() styleControl?: any;
  @Input() set autofocus(value: { delay: number } | boolean | undefined) {
    this._autofocus = (typeof value === 'boolean' ? value : true);
    const delay = (typeof value === 'object' ? value.delay : 10) ?? 10;
    setTimeout(() => {
      if(this.inputEl) {
        this.inputEl.nativeElement.setAttribute('autofocus', 'autofocus');
        this.inputEl.nativeElement.focus();

        setTimeout(() => {
          this.inputEl?.nativeElement.removeAttribute('autofocus');
        });
      } else {
        this.elementRef.nativeElement.focus();
        this.focus();
      }

    }, delay);
  }

  get autofocus() {
    return this._autofocus;
  }

  @Output() onChange = new EventEmitter<T>();
  @Output() onKeydown = new EventEmitter<KeyboardEvent>();
  @Output() onKeyup = new EventEmitter<KeyboardEvent>();

  @ViewChild('inputEl') inputEl?: ElementRef<HTMLInputElement>;

  @HostListener('focus', ['$event'])
  onFocus(e: FocusEvent) {
    this.focused = true;
    this.inputEl?.nativeElement.focus();
    this.render();
  }

  @HostListener('blur', ['$event'])
  onBlur(e: FocusEvent) {
    this.focused = false;
    this.formControl?.markAsTouched();
    this.render();
  }

  @HostListener('click', ['$event'])
  onClick(e: MouseEvent) {
    this.inputEl?.nativeElement.focus();
  }

  validationsTemplate?: TemplateRef<any>;

  get isRequired() {
    return this.formControl.hasValidator(Validators.required);
  }

  @ContentChildren(TemplateDirective)
  private set _templates(value: QueryList<TemplateDirective>) {
    this.validationsTemplate = value.find(x => x.includesName('validation'))?.template;
  }

  protected _onTouch: any;
  protected _onChange: any;
  protected ngControl?: NgControl | null;
  protected controlContainer?: ControlContainer | null;


  focused: boolean = false;
  focusable: boolean = true;

  constructor(injector: Injector) {
    super(injector);
  }

  override ngOnInit(): void {
    super.ngOnInit();
    this.controlContainer = this.injector.get(ControlContainer, undefined, {optional: true});
    this.ngControl = this.injector.get(NgControl, undefined, {optional: true});

    this.init();
    this.render();
  }

  override ngOnChanges(changes: SimpleChanges): void {
    if (!this.formControl) return;
    this.render();
  }

  init() {
    if(this.ngControl) {
      if(!this.formControl) {
        if (this.ngControl instanceof FormControlName && this.controlContainer?.control instanceof FormGroup) {
          if(this.ngControl.name) {
            this.formControl = this.controlContainer.control.controls[this.ngControl.name] as FormControl;
          }
        }
      }
      if (!this.formControl) {
        if (this.ngControl.control instanceof FormControl)
        {
          this.formControl = this.ngControl.control;
        }
      }
    }
    const formControlService = this.injector.get(FormControlService, null, {optional: true});
    if (!this.formControl && formControlService?.formControl) {
      this.formControl = formControlService.formControl;
    }
    if (!this.formControl) this.formControl = new FormControl();

    this.size = formControlService?.size ?? this.size;

    //============== Listener ===============\\
    let value: any;
    this.subscription.add(this.formControl.valueChanges.subscribe((e: any) => {
      if (value === e) return;
      value = e;
      this.render();
      this.onChange.emit(e);
      this.formControl?.markAsDirty();
      if(this._onChange) this._onChange(e);
      if(this._onTouch) this._onTouch(e);
    }));
  }

  registerOnChange(fn: any): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this._onTouch = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    if (this.formControl) {
      if (isDisabled) {
        if (this.formControl.enabled) this.formControl.disable();
      } else {
        if (this.formControl.disabled) this.formControl.enable();
      }
      this.render();
    }
  }

  writeValue(value: T): void {
    if (this.formControl?.getRawValue() !== value) {
      this.formControl?.setValue(value);
    }
    this.render();
  }

  override render() {
    super.render();

    if(this.focusable) {
      this.elementRef.nativeElement.setAttribute('tabIndex', '0');
    } else {
      this.elementRef.nativeElement.removeAttribute('tabIndex');
    }

    this.setClass('focused', this.focused);
    this.setClass('disabled', !!this.formControl?.disabled);
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
