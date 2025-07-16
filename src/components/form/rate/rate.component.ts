import {Component, HostListener, Input} from '@angular/core';
import {AbstractControl, createControlValueAccessor} from "../abstract-control.directive";
import {CommonModule} from "@angular/common";

@Component({
    standalone: true,
    imports: [CommonModule],
    selector: 'd-rate',
    templateUrl: 'rate.component.html',
    styleUrls: ['../control.scss', './rate.component.scss'],
    providers: [createControlValueAccessor(RateComponent)]
})
export class RateComponent extends AbstractControl<number> {

    @Input() count: number = 5;
    @Input() icon: string = 'far fa-star';
    @Input() iconActive: string = 'far fa-star-fill';

    items: boolean[] = [];

    hoverIndex = -1;

    @HostListener('keydown.space')
    onKeyDownSpace() {
    }

    @HostListener('mouseleave')
    onMouseLeave() {
        this.hoverIndex = -1;
        this.render();
    }

    override onClick(e: MouseEvent) {
        super.onClick(e);
    }

    override render() {
        super.render();

        if (this.items.length != this.count) {
            this.items = [];
            for (let i = 0; i < this.count; i++) this.items.push(false);
        }
        for (let i = 0; i < this.items.length; i++) {
            this.items[i] = (this.hoverIndex > -1 ? (i <= this.hoverIndex) : (this.formControl.value >= i));
        }
    }

    onMouseEnterItem(index: number) {
        this.hoverIndex = index;
        this.render();
    }

}
