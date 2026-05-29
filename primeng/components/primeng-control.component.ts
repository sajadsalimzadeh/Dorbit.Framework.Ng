import { Directive, ElementRef, Injector, Input, OnDestroy, OnInit } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import { Subscription } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

@Directive()
export abstract class PrimengControlComponent<T = any> implements OnInit, OnDestroy, ControlValueAccessor {
    @Input() name: string = uuidv4();

    private _services: any = {};

    protected value?: T;
    protected onChange!: (value: T | undefined) => void;
    protected onTouched!: () => void;
    protected isDisabled: boolean = false;
    protected subscription = new Subscription();

    get elementRef(): ElementRef {
        return this._services['ElementRef'] ??= this.injector.get(ElementRef);
    }

    constructor(protected injector: Injector) {
    }

    ngOnInit() { }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    // Write a new value to the element
    writeValue(value: T | undefined): void {
        this.value = value;
    }

    // Save the function that should be called when the value changes
    registerOnChange(fn: (value: T | undefined) => void): void {
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
