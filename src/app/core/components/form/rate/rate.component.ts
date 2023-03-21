import {Component, HostListener, Input, SimpleChanges} from '@angular/core';
import {AbstractFormControl, createControlValueAccessor} from "../form-control.directive";

@Component({
  selector: 'dev-rate',
  templateUrl: 'rate.component.html',
  styleUrls: ['./rate.component.scss', '../control.scss'],
  providers: [createControlValueAccessor(RateComponent)]
})
export class RateComponent extends AbstractFormControl<number> {

  @Input() count: number = 5;
  @Input() icon: string = 'far fa-star';
  @Input() iconActive: string = 'fas fa-star';

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
