import {AfterViewInit, Component, ComponentRef, HostBinding, HostListener, OnInit, TemplateRef} from "@angular/core";

type Direction = 'up' | 'down';

@Component({
  selector: 'dev-overlay',
  templateUrl: './overlay.component.html',
  styleUrls: ['./overlay.component.scss']
})
export class OverlayComponent implements OnInit, AfterViewInit {
  isViewInit = false;

  relatedElement?: HTMLElement;
  template?: TemplateRef<any>;
  componentRef?: ComponentRef<OverlayComponent>;

  verticalThreshold = 200;
  verticalDirection: Direction = 'down';

  horizontalThreshold = 100;
  horizontalReverse: boolean = false;

  animation: string = 'fade';

  @HostBinding('class') classes: any = {};
  @HostBinding('style') styles: any = {};

  @HostListener('window:click', ['$event'])
  onWindowClick() {
    if (this.isViewInit && this.componentRef) {
      this.componentRef.destroy();
    }
  }

  @HostListener('click', ['$event'])
  onClick(e: MouseEvent) {
    e.stopPropagation();
  }

  constructor() {
  }

  ngOnInit(): void {
    this.render();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.isViewInit = true;
    }, 1)
  }

  render() {
    if (!this.relatedElement) return;

    const rect = this.relatedElement.getBoundingClientRect();
    const topOfScreen = window.innerHeight + window.scrollY;
    const horizontalOfScreen = window.innerWidth + window.scrollX;

    const top = rect.top + window.scrollY;
    const left = rect.left + window.scrollX;
    const right = rect.right + window.scrollX;


    this.styles.width = rect.width + 'px';
    this.styles.left = left + 'px';

    const dir = getComputedStyle(document.body).direction;

    if (dir == 'ltr') {
      if (horizontalOfScreen - this.horizontalThreshold < left) {
        this.horizontalReverse = true;
      }
    } else {
      if (horizontalOfScreen - this.horizontalThreshold < right) {
        this.horizontalReverse = true;
      }
    }

    if (topOfScreen - this.verticalThreshold < top) {
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
