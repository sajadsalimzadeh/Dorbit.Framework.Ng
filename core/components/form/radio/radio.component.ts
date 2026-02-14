import {Component, HostListener, Input} from '@angular/core';
import {AbstractControl, createControlValueAccessor} from "../abstract-control.directive";


@Component({
    standalone: true,
    imports: [],
    selector: 'd-radio',
    templateUrl: 'radio.component.html',
    styleUrls: ['../control.scss', './radio.component.scss'],
    providers: [createControlValueAccessor(RadioComponent)]
})
export class RadioComponent extends AbstractControl<any> {

    @Input() value: any;

    @HostListener('keydown.space')
    onKeyDownSpace() {
        this.toggle();
    }

    override onClick(e: MouseEvent) {
        this.toggle();
        super.onClick(e);
    }

    override render() {
        super.render();
        this.setClass('checked', this.formControl?.value == this.value);
    }

    toggle() {
        this.formControl.setValue(this.value);
    }
}
