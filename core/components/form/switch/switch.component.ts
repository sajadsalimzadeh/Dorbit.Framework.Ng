import {Component, HostListener} from '@angular/core';
import {AbstractControl, createControlValueAccessor} from "../abstract-control.directive";


@Component({
    standalone: true,
    imports: [],
    selector: 'd-switch',
    templateUrl: 'switch.component.html',
    styleUrls: ['../control.scss', './switch.component.scss'],
    providers: [createControlValueAccessor(SwitchComponent)]
})
export class SwitchComponent extends AbstractControl<boolean | null> {

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
        this.setClass('checked', !!this.formControl?.value);
    }

    toggle() {
        this.writeValue(!this.formControl?.value);
    }
}
