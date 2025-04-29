import {AfterViewInit, Component, ElementRef, HostListener, Input, ViewChild} from '@angular/core';
import {AbstractControl, createControlValueAccessor} from "../abstract-control.directive";
import {Orientation} from "../../../types";
import {NumberUtil} from "../../../utils/number";
import {CommonModule} from "@angular/common";

export interface VolumeRange {
    start: number;
    end: number;
}

@Component({
    standalone: true,
    imports: [CommonModule],
    selector: 'd-volume',
    templateUrl: 'volume.component.html',
    styleUrls: ['../control.scss', './volume.component.scss'],
    providers: [createControlValueAccessor(VolumeComponent)]
})
export class VolumeComponent extends AbstractControl<number | VolumeRange> implements AfterViewInit {

    @Input() min = 0;
    @Input() max = 100;
    @Input() step = 1;
    @Input() showRange: boolean = true;
    @Input() orientation: Orientation = 'horizontal';
    @Input() mode: 'single' | 'multiple' = 'single';
    @ViewChild('volumeBoxEl') volumeBoxEl?: ElementRef<HTMLDivElement>;
    @ViewChild('valueBarEl') valueBarEl?: ElementRef<HTMLDivElement>;
    private onMouseMove?: (e: MouseEvent) => void;
    private onTouchMove?: (e: TouchEvent) => void;

    @Input() formatter: (value: number) => string = (value: number) => NumberUtil.format(value);

    @HostListener('window:mouseup', ['$event'])
    onWindowMouseUp() {
        if (this.onMouseMove) {
            window.removeEventListener('mousemove', this.onMouseMove)
        }
    }

    @HostListener('window:touchend', ['$event'])
    onWindowTouchEnd() {
        if (this.onTouchMove) {
            window.removeEventListener('touchmove', this.onTouchMove)
        }
    }

    override onClick(e: MouseEvent) {
        super.onClick(e);
    }

    override render() {
        super.render();
        this.setClass(this.dir, true);
        this.setClass(this.orientation, true);
        this.processStyles();
    }

    override ngAfterViewInit(): void {
        this.processStyles();
    }

    processStyles() {
        const containerBarEl = this.volumeBoxEl?.nativeElement;
        const valueBarEl = this.valueBarEl?.nativeElement;
        if (!containerBarEl || !valueBarEl) return;

        const range = this.getRange();
        const totalSize = (this.orientation == 'horizontal' ? containerBarEl.offsetWidth : containerBarEl.offsetHeight);
        const totalValue = this.max - this.min;
        const startSize = (range.start - this.min) * totalSize / totalValue;
        const endSize = (this.max - range.end) * totalSize / totalValue;
        this.dir = getComputedStyle(containerBarEl).direction as any;
        if (this.orientation == 'horizontal') {
            valueBarEl.style.top = '';
            valueBarEl.style.bottom = '';

            if (this.dir == 'rtl') {
                valueBarEl.style.left = endSize + 'px';
                valueBarEl.style.right = startSize + 'px';
            } else {
                valueBarEl.style.right = endSize + 'px';
                valueBarEl.style.left = startSize + 'px';
            }

        } else {
            valueBarEl.style.left = '';
            valueBarEl.style.right = '';
            valueBarEl.style.top = startSize + 'px';
            valueBarEl.style.bottom = endSize + 'px';
        }
    }

    onDragStart(e: MouseEvent | TouchEvent, type: 'start' | 'end') {
        if (this.formControl.disabled) return;
        const containerBarEl = this.volumeBoxEl?.nativeElement;
        if (!containerBarEl) return;

        const totalSize = (this.orientation == 'horizontal' ? containerBarEl.offsetWidth : containerBarEl.offsetHeight);
        const totalValue = this.max - this.min;
        const stepSize = totalSize / totalValue;

        const getValue = () => {
            const range = this.getRange();
            if (type == 'start') return range.start;
            return range.end;
        }

        const setValue = (value: number) => {
            if (value < this.min) value = this.min;
            if (value > this.max) value = this.max;
            if (this.mode === 'single') {
                this.formControl?.setValue(value);
            } else {
                const range = this.getRange();
                if (type == 'start' && value > range['end']) value = range['end'];
                if (type == 'end' && value < range['start']) value = range['start'];
                range[type] = value;
                this.formControl?.setValue({...range});
            }
        }
        const firstValue = getValue();

        if (e instanceof TouchEvent) {
            this.onWindowTouchEnd();
            window.addEventListener('touchmove', this.onTouchMove = (we) => {
                const diff = (this.orientation == 'horizontal' ? (we.touches[0].pageX - e.touches[0].pageX) : (we.touches[0].pageY - e.touches[0].pageY));
                let value = firstValue + (diff / stepSize);
                value = Math.round(value / this.step) * this.step;
                if (getValue() != value) {
                    setValue(value);
                }
            });
        }

        if (e instanceof MouseEvent) {
            this.onWindowMouseUp();
            window.addEventListener('mousemove', this.onMouseMove = (we) => {
                const diff = (this.orientation == 'horizontal' ? (we.pageX - e.pageX) : (we.pageY - e.pageY));
                let value = firstValue + (diff / stepSize);
                value = Math.round(value / this.step) * this.step;
                if (getValue() != value) {
                    setValue(value);
                }
            });
        }


    }

    private getRange(): VolumeRange {
        if (this.formControl?.value && typeof this.formControl?.value === 'object') {
            return this.formControl.value;
        }
        return {
            start: this.min ?? 0,
            end: this.formControl?.value
        }
    }
}
