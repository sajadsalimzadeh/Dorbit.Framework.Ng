import {AfterViewInit, Directive, ElementRef, Injector, Input, OnChanges, OnDestroy, OnInit, ProviderToken, SimpleChanges} from "@angular/core";
import {TranslateService} from "@ngx-translate/core";
import {Subscription} from "rxjs";
import {Colors, Direction, Sizes} from "../types";
import {LoadingService} from "../services/loading.service";

@Directive()
export abstract class AbstractComponent implements OnInit, OnChanges, OnDestroy, AfterViewInit {

    @Input() size: Sizes = 'md';
    @Input() color: Colors = 'primary';
    @Input() colorText: Colors = 'primary';
    @Input() ngClass?: any;
    @Input() dir: Direction = '';
    elementRef: ElementRef<HTMLElement>;
    protected classNames: string[] = [];
    protected _services: any = {};

    constructor(protected injector: Injector) {
        this.elementRef = injector.get(ElementRef);
    }

    private _subscription?: Subscription;

    protected get subscription() {
        return this._subscription ??= new Subscription();
    }

    protected get translateService(): TranslateService {
        return this.getInstance('TranslateService', TranslateService);
    }

    protected get loadingService(): LoadingService {
        return this.getInstance('LoadingService', LoadingService);
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
        this._subscription?.unsubscribe();
    }

    render() {
        this.resetClasses();
        if (this.ngClass) {
            for (let className in this.ngClass) {
                this.setClass(className, !!this.ngClass[className])
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

    protected getInstance<T>(key: string, type: ProviderToken<T>): T {
        return this._services[key] ??= this.injector.get(type)
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
