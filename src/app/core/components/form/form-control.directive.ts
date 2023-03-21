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
import {DevTemplateDirective} from "../../directives/template/dev-template.directive";
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

  @ContentChildren(DevTemplateDirective)
  private set _templates(value: QueryList<DevTemplateDirective>) {
    this.validationsTemplate = value.find(x => x.name == 'validation')?.template;
  }

  focused: boolean = false;

  formControl!: FormControl<T>;

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
  }

  override ngOnChanges(changes: SimpleChanges): void {
    this.init();
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
