import {
  Component, Input
} from '@angular/core';
import {BaseComponent} from "../base.component";

@Component({
  selector: 'dev-skeleton',
  templateUrl: 'skeleton.component.html',
  styleUrls: ['./skeleton.component.scss']
})
export class SkeletonComponent extends BaseComponent {
  @Input() shape: 'rectangle' | 'circle' = 'rectangle';
  @Input() radius: number | string = 2;
  @Input() ratio: string = '4:4'

  override render() {
    super.render();
    this.classes[this.shape] = true;

    const ratioSplit = this.ratio.split(':');
    if(ratioSplit.length < 1 || ratioSplit.find(x => Number.isNaN(parseFloat(x)))) return;
    const width = parseFloat(ratioSplit[0])
    const height = (ratioSplit.length > 1 ? parseFloat(ratioSplit[1]) : width);

    const el = this.elementRef.nativeElement;
    el.style.width = width + 'em';
    el.style.height = height + 'em';
    el.style.setProperty('--radius-component', `var(--radius-${this.radius})`);
  }
}
