import {
  Component, HostBinding, HostListener, Input,
} from '@angular/core';
import {BaseComponent} from "../base.component";
import {PositionsCorner} from "../../types";

@Component({
  selector: 'd-scroll-top',
  templateUrl: 'scroll-top.component.html',
  styleUrls: ['./scroll-top.component.scss']
})
export class ScrollTopComponent extends BaseComponent {
  private _target: any = window;
  private _listener: any;

  @Input() threshold = 50;
  @Input() icon: string = 'far fa-angle-up';
  @Input() position: PositionsCorner = 'bottom-end';

  @HostBinding('class.show')
  private show: boolean = false;

  @HostListener('click')
  gotTop() {
    this._target.scrollTo({top: 0, behavior: 'smooth'})
  }

  override ngOnInit() {
    super.ngOnInit();
    this.initTarget();
  }

  override render() {
    super.render();
    this.classes[this.position] = true;
  }

  private initTarget() {
    let el = this.elementRef.nativeElement.parentNode as HTMLElement;
    while (el && el.tagName.toLowerCase() != 'body') {
      if (el.clientHeight < el.scrollHeight - 200) {
        this.setTarget(el);
        return;
      }
      el = el.parentNode as HTMLElement;
    }
    this.setTarget(window);
  }

  private setTarget(target: any) {
    if (this._target) {
      this._target.removeEventListener('scroll', this._listener);
    }
    this._target = target;
    target.addEventListener('scroll', this._listener = (e: Event) => {
      if (target.scrollY) {
        this.show = target.scrollY > this.threshold;
      }
    });
  }
}
