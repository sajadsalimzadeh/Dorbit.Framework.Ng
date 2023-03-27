import {
  Component,
  ElementRef,
  HostBinding,
  HostListener,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {BaseComponent} from "../base.component";

@Component({
  selector: 'd-button',
  templateUrl: 'button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent extends BaseComponent implements OnInit, OnChanges {

  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() icon?: string;
  @Input() iconPos: 'start' | 'end' = 'start';
  @Input() rounded?: boolean = false;
  @Input() disabled?: boolean = false;
  @Input() mode: 'fill' | 'outline' | 'text' = 'fill';
  @Input() loading?: boolean = false;
  @Input() loadingIcon?: string = 'fas fa-circle-notch';

  @ViewChild('textEl') set textRef(value: ElementRef<HTMLElement>) {
    this.emptyContent = !value.nativeElement?.innerText && !value.nativeElement?.innerHTML;
    this.render();
  }

  @HostListener('click', ['$event']) onClick(e: MouseEvent) {
    e.stopPropagation();
  }

  activeIcon?: string;
  emptyContent: boolean = false;

  override ngOnInit() {
  }

  override ngOnChanges(changes: SimpleChanges): void {
    this.render();
  }

  override render() {
    super.render();
    if(this.loading) {
      this.activeIcon = this.loadingIcon;
    }
    else {
      this.activeIcon = this.icon;
    }

    this.classes = {};
    this.classes[this.color] = true;
    this.classes[this.size] = true;
    this.classes['rounded'] = this.rounded;
    this.classes['outline'] = this.mode == 'outline';
    this.classes['fill'] = this.mode == 'fill';
    this.classes['text'] = this.mode == 'text';
    this.classes['icon-start'] = this.activeIcon && this.iconPos == 'start';
    this.classes['icon-end'] = this.activeIcon && this.iconPos == 'end';
    this.classes['empty-content'] = this.emptyContent;
    this.classes['has-content'] = !this.emptyContent;
    this.classes['loading'] = this.loading;
    this.classes['disabled'] = this.disabled;
  }
}
