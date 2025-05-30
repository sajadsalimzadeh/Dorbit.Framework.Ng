import {Component, HostListener, Input} from '@angular/core';
import {AbstractControl, createControlValueAccessor} from "../abstract-control.directive";
import {CommonModule} from "@angular/common";

@Component({
    standalone: true,
    imports: [CommonModule],
    selector: 'd-checkbox',
    templateUrl: 'checkbox.component.html',
    styleUrls: ['../control.scss', './checkbox.component.scss'],
    providers: [createControlValueAccessor(CheckboxComponent)]
})
export class CheckboxComponent extends AbstractControl<boolean | null> {
    @Input() mode: 'binary' | 'ternary' = 'binary';

    @HostListener('keydown.space')
    onKeyDownSpace() {
        this.toggle();
    }

    override onClick(e: MouseEvent) {
        this.toggle();
        super.onClick(e);
    }

    override writeValue(value: boolean | null) {
        super.writeValue(value);
        if (this.mode == 'binary' && !value && value !== false) {
            this.formControl?.setValue(false);
        }
    }

    override render() {
        super.render();
        const value = this.formControl?.value;
        this.setClass('fill', (value === true || value === null || value === undefined));
        let valueName: string;
        if (value === true) valueName = 'true';
        else if (value === null || value === undefined) valueName = 'null';
        else valueName = 'false';
        this.setClass('value-' + valueName, true);
    }

    toggle() {
        if (this.formControl.disabled) return;
        let value = this.formControl?.value;
        if (this.mode == 'ternary' && value === null || value === undefined) {
            value = false;
        } else if (value) {
            value = (this.mode == 'ternary' ? null : false);
        } else value = true;
        this.writeValue(value);
    }
}
