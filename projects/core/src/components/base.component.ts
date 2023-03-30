import {
  Directive,
  ElementRef,
  HostBinding,
  Injector,
  Input,
  OnChanges, OnDestroy,
  OnInit,
  SimpleChanges
} from "@angular/core";
import {Colors, Sizes} from "../types";
import {Subscription} from "rxjs";


@Directive()
export abstract class BaseComponent implements OnInit, OnChanges, OnDestroy {
  @Input() size: Sizes = 'md';
  @Input() color: Colors = 'primary';
  @Input() ngClasses?: any;

  direction: 'rtl' | 'ltr' = 'ltr';

  @HostBinding('class')
  classes: any = {};

  @HostBinding('style')
  styles: any = {};

  protected subscription = new Subscription();

  protected elementRef: ElementRef<HTMLElement>;

  constructor(protected injector: Injector) {
    this.elementRef = injector.get(ElementRef);
  }

  ngOnInit() {
    this.render();
  }

  ngOnChanges(changes: SimpleChanges) {
    this.render();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  render() {
    this.classes = {...this.ngClasses};
    this.styles = {};
    this.classes[this.size] = true;
    this.classes[this.color] = true;

    if (this.elementRef) {
      this.direction = getComputedStyle(this.elementRef.nativeElement).direction as any;
      this.classes['direction-' + this.direction] = true;
    }

    let color = '', colorRgb = '';
    // Handle HEX Format
    if (this.color.startsWith('#')) {
      color = this.color;
      colorRgb = this.hexToRgb(this.color);
    }
    // Handle RGB And RGBA Format
    else if (this.color.startsWith('rgb')) {
      color = this.color;
      const rgbColors = /[0-9]+/.exec(this.color);
      if (rgbColors && rgbColors.length > 2) colorRgb = `${rgbColors[0]}, ${rgbColors[1]}, ${rgbColors[2]}`;
    }
    // Handle Variable Format
    else {
      color = `var(--color-${this.color})`;
      colorRgb = `var(--color-${this.color}-rgb)`;
    }
    this.elementRef.nativeElement.style.setProperty('--color-component', color);
    this.elementRef.nativeElement.style.setProperty('--color-component-rgb', colorRgb);
  }

  private hexToRgb(hex: string) {
    if (hex.length == 4) {
      const r = parseInt(hex[1], 16);
      const g = parseInt(hex[2], 16);
      const b = parseInt(hex[3], 16);
      return `${r},${g},${b}`;
    } else if (hex.length == 7) {
      const r = parseInt(hex[1] + hex[2], 16);
      const g = parseInt(hex[3] + hex[4], 16);
      const b = parseInt(hex[5] + hex[6], 16);
      return `${r},${g},${b}`;
    }
    return '';
  }
}
