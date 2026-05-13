import { Directive, ElementRef, Injector, Input, OnDestroy, OnInit } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import { Subscription } from 'rxjs';

@Directive()
export class PrimengControlComponent<T = any> implements OnInit, OnDestroy, ControlValueAccessor {
    @Input() name: string = '';

    _services: any = {};

    value?: T;
    onChange = (value: T) => {};
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
    writeValue(value: T): void {
        this.value = value;
    }

    // Save the function that should be called when the value changes
    registerOnChange(fn: (value: T) => void): void {
        this.onChange = fn;
    }

    // Save the function that should be called when the control is touched
    registerOnTouched(fn: () => void): void {
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
