import { Directive, ElementRef, Injector, OnDestroy, OnInit } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import { Subscription } from 'rxjs';

@Directive()
export class PrimengControlComponent implements OnInit, OnDestroy, ControlValueAccessor {
    _services: any = {};

    value?: any;
    onChange = (value: any) => {};
    onTouched = () => {};
    isDisabled: boolean = false;

    subscription = new Subscription();

    get elementRef(): ElementRef {
        return this._services['ElementRef'] ??= this.injector.get(ElementRef);
    }

    constructor(protected injector: Injector) {
    }

    ngOnInit() {
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    // Write a new value to the element
    writeValue(value: any): void {
        value = value ?? '';
    }

    // Save the function that should be called when the value changes
    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    // Save the function that should be called when the control is touched
    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    // Enable or disable the component
    setDisabledState(isDisabled: boolean): void {
        if (isDisabled) {
            this.isDisabled = true;
        } else {
            this.isDisabled = false;
        }
    }
}
