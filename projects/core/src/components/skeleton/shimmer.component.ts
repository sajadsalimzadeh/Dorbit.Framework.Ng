import {
  Component, Input
} from '@angular/core';
import {BaseComponent} from "../base.component";

const units = ['%', 'px', 'pt', 'rem', 'em', 'cm'];

@Component({
  selector: 'd-shimmer',
  templateUrl: 'shimmer.component.html',
  styleUrls: ['./shimmer.component.scss']
})
export class ShimmerComponent extends BaseComponent {
  @Input() radius: string = '6px';
  @Input() ratio: string = '4:4'

  override render() {
    super.render();

    const ratioSplit = this.ratio.split(':');
    if(ratioSplit.length < 1 || ratioSplit.find(x => Number.isNaN(parseFloat(x)))) return;
    let width_string = ratioSplit[0];
    let height_string = (ratioSplit.length > 1 ? ratioSplit[1] : width_string);

    const width_unit = units.find(x => width_string.includes(x)) ?? 'em';
    const height_unit = units.find(x => height_string.includes(x)) ?? 'em';
    width_string = width_string.replace(width_unit, '');
    height_string = height_string.replace(height_unit, '');

    const width = parseFloat(width_string)
    const height = parseFloat(height_string);

    const el = this.elementRef.nativeElement;
    el.style.width = width + width_unit;
    el.style.height = height + height_unit;
    el.style.setProperty('--radius-component', this.radius);
  }
}
