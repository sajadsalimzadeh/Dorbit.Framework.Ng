import {
  Component, HostBinding, HostListener, Input,
} from '@angular/core';
import {BaseComponent} from "../base.component";
import {Colors} from "../../types";

@Component({
  selector: 'dev-scroll-top',
  templateUrl: 'scroll-top.component.html',
  styleUrls: ['./scroll-top.component.scss']
})
export class ScrollTopComponent extends BaseComponent {
  private _target: any = window;
  private _listener: any;

  @Input() threshold = 50;
  @Input() icon: string = 'far fa-angle-up';
  @Input() pos: 'top-start' | 'top-end' | 'bottom-start' | 'bottom-end' = 'bottom-end';

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
    this.classes[this.pos] = true;
  }

  private initTarget() {
    let el = this.elementRef.nativeElement.parentNode as HTMLElement;
    while (el) {
      if(el.clientHeight < el.scrollHeight) {
        this.setTarget(el);
        return;
      }
      el = el.parentNode as HTMLElement;
    }
    this.setTarget(window);
  }

  private setTarget(target: any) {
    if(this._target) {
      this._target.removeEventListener('scroll', this._listener);
    }
    this._target = target;
    target.addEventListener('scroll', this._listener = (e: Event) => {
      if(e.target instanceof HTMLElement) {
        this.show = e.target.scrollTop > this.threshold;
      }
    });
  }
}
