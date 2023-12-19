import {
  AfterViewInit,
  Directive,
  ElementRef,
  Injector,
  Input,
  OnChanges, OnDestroy,
  OnInit,
  SimpleChanges
} from "@angular/core";
import {Subscription} from "rxjs";
import {Location} from "@angular/common";
import {TranslateService} from "@ngx-translate/core";
import {ActivatedRoute, Router} from "@angular/router";
import {Colors, Direction, Sizes} from "../types";
import {MessageService} from "./message/services/message.service";
import {LoadingService} from "../services/loading.service";

@Directive()
export abstract class BaseComponent implements OnInit, OnChanges, OnDestroy, AfterViewInit {

  @Input() size: Sizes = 'md';
  @Input() color: Colors = 'primary';
  @Input() colorText: Colors = 'primary';
  @Input() ngClasses?: any;
  @Input() dir: Direction = '';

  protected _services: any = {};

  protected get route(): ActivatedRoute {
    return this._services['ActivatedRoute'] ??= this.injector.get(ActivatedRoute);
  }

  protected get router(): Router {
    return this._services['Router'] ??= this.injector.get(Router);
  }

  protected get location(): Location {
    return this._services['Location'] ??= this.injector.get(Location);
  }

  protected get loadingService(): LoadingService {
    return this._services['LoadingService'] ??= this.injector.get(LoadingService);
  }

  protected get messageService(): MessageService {
    return this._services['MessageService'] ??= this.injector.get(MessageService);
  }

  protected get translateService(): TranslateService {
    return this._services['TranslateService'] ??= this.injector.get(TranslateService);
  }

  protected subscription = new Subscription();

  elementRef: ElementRef<HTMLElement>;

  constructor(protected injector: Injector) {
    this.elementRef = injector.get(ElementRef);
  }

  ngOnInit() {
    this.render();
  }

  ngAfterViewInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    this.render();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  render() {
    this.resetClasses();
    if (this.ngClasses) {
      for (let className in this.ngClasses) {
        this.setClass(className, !!this.ngClasses[className])
      }
    }
    this.setClass(this.size, true);
    this.setClass(this.color, true);

    if (this.elementRef) {
      if (!this.dir) {
        this.dir = getComputedStyle(this.elementRef.nativeElement).direction as any;
      }
      this.setClass('direction-' + this.dir, true);
    }

    let color = '',
      colorRgb = '',
      colorText = '';
    // Handle HEX Format
    if (this.color.startsWith('#')) {
      color = this.color;
      colorRgb = this.hexToRgb(this.color);
      colorText = this.colorText;
    }
    // Handle RGB And RGBA Format
    else if (this.color.startsWith('rgb')) {
      color = this.color;
      colorText = this.colorText;

      const rgbColors = /[0-9]+/.exec(this.color);
      if (rgbColors && rgbColors.length > 2) colorRgb = `${rgbColors[0]}, ${rgbColors[1]}, ${rgbColors[2]}`;
    }
    // Handle Variable Format
    else {
      color = `var(--color-${this.color})`;
      colorRgb = `var(--color-${this.color}-rgb)`;
      colorText = `var(--color-${this.color}-text)`;
    }
    this.elementRef.nativeElement.style.setProperty('--color-component', color);
    this.elementRef.nativeElement.style.setProperty('--color-component-rgb', colorRgb);
    this.elementRef.nativeElement.style.setProperty('--color-component-text', colorText);
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

  classNames: string[] = [];

  resetClasses(element: Element = this.elementRef.nativeElement) {
    this.classNames.forEach(x => element.classList.remove(x));
  }

  setClass(className: string, status?: boolean, element: Element = this.elementRef.nativeElement) {
    if (!this.classNames.includes(className)) {
      this.classNames.push(className);
    }
    if (status) {
      element.classList.add(className);
    } else {
      element.classList.remove(className);
    }
  }

  t(key: string): string {
    return this.translateService.instant(key);
  }
}
