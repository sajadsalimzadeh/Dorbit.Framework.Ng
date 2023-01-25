import {Component, HostBinding} from "@angular/core";
import {DomService} from "../../services/dom.service";

type Direction = 'up' | 'down';

@Component({
  selector: 'dev-overlay',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class OverlayComponent {
  verticalThreshold = 200;
  verticalDirection: Direction = 'down';

  horizontalReverse: boolean = false;
  horizontalThreshold = 100;

  animation: string = 'fade-scale-vertical';

  @HostBinding('class') classes: any = {};
  @HostBinding('style') styles: any = {};


  constructor() {
  }

  show(element: HTMLElement) {
    this.verticalDirection = 'down';
    this.horizontalReverse = false;

    const rect = element.getBoundingClientRect();
    const topOfScreen = window.innerHeight + window.scrollY;
    const horizontalOfScreen = window.innerWidth + window.scrollX;

    const top = rect.top + window.scrollY;
    const left = rect.left + window.scrollX;
    const right = rect.right + window.scrollX;

    this.styles.width = rect.width + 'px';
    this.styles.height = rect.height + 'px';
    this.styles.left = left + 'px';

    const dir = getComputedStyle(document.body).direction;

    if(dir == 'ltr') {
      if(horizontalOfScreen - this.horizontalThreshold < left + rect.width) {
        this.horizontalReverse = true;
      }
    } else {
      if(horizontalOfScreen - this.horizontalThreshold < right + rect.width) {
        this.horizontalReverse = true;
      }
    }

    if (topOfScreen - 200 < top) {
      this.styles.top = top + 'px';
      this.verticalDirection = 'up';
    } else {
      this.styles.top = (top + rect.height) + 'px';
    }

    this.classes['vr-up'] = (this.verticalDirection == 'up');
    this.classes['vr-down'] = (this.verticalDirection == 'down');
    this.classes['hr-reverse'] = this.horizontalReverse;
    this.classes[this.animation] = !!this.animation;
  }
}
