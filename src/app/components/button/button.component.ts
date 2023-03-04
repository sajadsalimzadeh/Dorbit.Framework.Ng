import {Component, ElementRef, HostBinding, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';

@Component({
  selector: 'dev-button',
  templateUrl: 'button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent implements OnInit, OnChanges {

  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() icon?: string;
  @Input() iconPos: 'start' | 'end' = 'start';
  @Input() size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' = 'md';
  @Input() status: 'primary' | 'secondary' | 'success' | 'link' | 'warning' | 'help' | 'danger' = 'primary';
  @Input() rounded?: boolean = false;
  @Input() disabled?: boolean = false;
  @Input() mode: 'fill' | 'outline' | 'text' = 'fill';
  @Input() loading?: boolean = false;
  @Input() loadingIcon?: string = 'fas fa-circle-notch';

  @ViewChild('textEl') set textRef(value: ElementRef<HTMLElement>) {
    this.emptyContent = !value.nativeElement?.innerText && !value.nativeElement?.innerHTML;
    this.render();
  }

  activeIcon?: string;
  emptyContent: boolean = false;

  @HostBinding('class')
  classes: any = {};

  constructor() {
  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.render();
  }

  render() {
    if(this.loading) {
      this.activeIcon = this.loadingIcon;
    }
    else {
      this.activeIcon = this.icon;
    }

    this.classes = {};
    this.classes[this.status] = true;
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
