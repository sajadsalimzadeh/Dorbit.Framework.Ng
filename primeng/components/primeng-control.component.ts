import {Directive, ElementRef, Injector, Input, OnChanges, OnDestroy, SimpleChanges} from '@angular/core';
import {FormControl} from '@angular/forms';
import {Subscription} from 'rxjs';

@Directive()
export class PrimengControlComponent implements OnChanges, OnDestroy {
    _services: any = {};
    _onChange?: (value: string) => void;
    _onTouched?: () => void;

    @Input() formControl = new FormControl<any>(null);

    subscription = new Subscription();

    get elementRef(): ElementRef {
        return this._services['ElementRef'] ??= this.injector.get(ElementRef);
    }

    constructor(protected injector: Injector) {
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['formControl']) {
            this.subscription.add(this.formControl.valueChanges.subscribe(value => {
                if (this._onChange) this._onChange(value)
            }));
        }
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    // Write a new value to the element
    writeValue(value: string): void {
        this.formControl.setValue(value)
    }

    // Save the function that should be called when the value changes
    registerOnChange(fn: any): void {
        this._onChange = fn;
    }

    // Save the function that should be called when the control is touched
    registerOnTouched(fn: any): void {
        this._onTouched = fn;
    }

    // Enable or disable the component
    setDisabledState(isDisabled: boolean): void {
        if (isDisabled) this.formControl.disable();
        else this.formControl.enable();
    }
}
