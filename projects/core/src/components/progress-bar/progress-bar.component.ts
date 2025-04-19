import {AfterViewInit, Component, ElementRef, Input, OnChanges, SimpleChanges, ViewChild} from '@angular/core';
import {AbstractComponent} from "../abstract.component";
import {CommonModule} from "@angular/common";

@Component({
    standalone: true,
    imports: [CommonModule],
    selector: 'd-progress-bar',
    templateUrl: 'progress-bar.component.html',
    styleUrls: ['./progress-bar.component.scss'],
})
export class ProgressBarComponent extends AbstractComponent implements OnChanges, AfterViewInit {
  @Input() value = 20;
  @Input() min = 0;
  @Input() max = 100;
  @Input() mode: 'normal' | 'indeterminate' = 'normal';

  @Input() showValue: boolean = false;

  @ViewChild('fillEl') fillEl!: ElementRef<HTMLDivElement>;

  override ngOnChanges(changes: SimpleChanges): void {
    this.render();
  }

  override ngAfterViewInit(): void {
    this.render();
  }

  override render() {
    super.render();

    if(this.mode == 'normal') {
      const fillEl = this.fillEl?.nativeElement;
      if (fillEl) {
        let value = this.value;
        if (value < this.min) value = this.min;
        if (value > this.max) value = this.max;
        value += this.min;
        const totalValue = this.max - this.min;
        fillEl.style.width = (value * 100 / totalValue) + '%';
      }
    }
  }
}
