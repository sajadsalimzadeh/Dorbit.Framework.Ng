import {Component, Input, SimpleChanges} from '@angular/core';
import {AbstractControl, createControlValueAccessor} from "../abstract-control.directive";
import {FormControl, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {Subscription} from "rxjs";
import {CommonModule} from "@angular/common";
import {InputComponent} from "../input/input.component";

@Component({
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        InputComponent,
    ],
    selector: 'd-input-split',
    templateUrl: './input-split.component.html',
    styleUrls: ['./input-split.component.scss'],
    providers: [createControlValueAccessor(InputSplitComponent)]
})
export class InputSplitComponent extends AbstractControl<string> {
    @Input({required: true}) length!: number;
    values: FormControl[] = [];
    valuesSubscription?: Subscription;

    override set autofocus(value: any) {
        setTimeout(() => {
            this.elementRef?.nativeElement.querySelector('input')?.focus();
        }, 10)
    }

    override ngOnInit() {
        super.ngOnInit();
    }

    override ngOnChanges(changes: SimpleChanges) {
        super.ngOnChanges(changes);

        if ('length' in changes) {
            this.valuesSubscription?.unsubscribe();
            this.valuesSubscription = new Subscription();
            this.values = [];
            for (let i = 0; i < this.length; i++) {
                const control = new FormControl('', [Validators.required, Validators.maxLength(1)]);
                this.valuesSubscription?.add(control.valueChanges.subscribe(e => {
                    this.onValueChanged();
                }));
                this.values.push(control);
            }
        }
    }

    onValueChanged() {
        const value = this.values.map(x => x.value).join('').substring(0, this.length).trim();
        for (let i = 0; i < this.values.length; i++) {
            if (this.values[i].value.length > 1) {
                this.values[i].setValue(value[i]);
            }
        }
        this.focusByIndex(this.values.findIndex(x => !x.value));
        this.formControl.setValue(value);
    }

    onKeyUp(index: number, e: KeyboardEvent) {
        if (e.key === 'Backspace') {
            if (!this.values[index].value) {
                this.focusByIndex(this.values.findIndex(x => !x.value) - 1);
            }
        }
    }

    focusByIndex(index: number) {
        const elements = this.elementRef?.nativeElement?.querySelectorAll('input');
        if (index > -1 && index < elements.length) {
            elements[index]?.focus();
        }
    }
}
