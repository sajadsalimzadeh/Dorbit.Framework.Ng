import {Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild} from '@angular/core';
import {AbstractComponent} from "../abstract.component";

@Component({
  selector: 'd-button',
  templateUrl: 'button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent extends AbstractComponent implements OnInit, OnChanges {

  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() icon?: string;
  @Input() iconPos: 'start' | 'end' = 'start';
  @Input() rounded?: boolean = false;
  @Input() disabled?: boolean = false;
  @Input() mode: 'fill' | 'outline' | 'text' = 'fill';
  @Input() loading?: boolean = false;
  @Input() loadingIcon?: string = 'icons-core-loading';

  @Output() onClick = new EventEmitter();

  @ViewChild('textEl') set textRef(value: ElementRef<HTMLElement>) {
    this.emptyContent = !value.nativeElement?.innerText && !value.nativeElement?.innerHTML;
    this.render();
  }

  activeIcon?: string;
  emptyContent: boolean = false;

  override render() {
    super.render();
    if (this.loading) {
      this.activeIcon = this.loadingIcon;
    } else {
      this.activeIcon = this.icon;
    }

    const el = this.elementRef.nativeElement;
    const mode = el.getAttribute('mode') as any;
    if(mode) this.mode = mode;

    this.setClass('rounded', this.rounded);
    this.setClass('outline', this.mode == 'outline');
    this.setClass('fill', this.mode == 'fill');
    this.setClass('text', this.mode == 'text');
    this.setClass('icon-start', !!this.activeIcon && this.iconPos == 'start');
    this.setClass('icon-end', !!this.activeIcon && this.iconPos == 'end');
    this.setClass('empty-content', this.emptyContent);
    this.setClass('has-content', !this.emptyContent);
    this.setClass('loading', this.loading);
    this.setClass('disabled', this.disabled || this.loading);
  }
}
