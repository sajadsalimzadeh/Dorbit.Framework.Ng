import {
  Component,
  ContentChildren, EventEmitter, HostBinding,
  Injector,
  Input, Output,
  QueryList,
  TemplateRef,
} from '@angular/core';
import {TemplateDirective} from "../../../../directives";
import {BaseComponent} from "../../../base.component";
import {Message} from "../../models";

@Component({
  selector: 'd-message',
  templateUrl: 'message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent extends BaseComponent {
  @Input() item!: Message;

  @Output() onRemove = new EventEmitter<Message>();

  @HostBinding('class.show')
  get show() {
    return this.item.show;
  }

  timer: number = 0;
  contentTemplate?: TemplateRef<any>;

  @ContentChildren(TemplateDirective) set templates(value: QueryList<TemplateDirective>) {
    this.contentTemplate = value.find(x => x.includesName('default', true))?.template;
  }

  constructor(injector: Injector) {
    super(injector);
  }

  override ngOnInit() {
    if (this.item.color) {
      this.color = this.item.color;
    }
    if (this.item.size) this.size = this.item.size;

    if (typeof this.item.icon === 'undefined') {
      switch (this.color) {
        case 'primary':
          this.item.icon = 'far fa-info-circle';
          break;
        case 'secondary':
          this.item.icon = 'far fa-circle-exclamation';
          break;
        case 'warning':
          this.item.icon = 'far fa-warning';
          break;
        case 'success':
          this.item.icon = 'far fa-check';
          break;
        case 'link':
          this.item.icon = 'far fa-link';
          break;
        case 'danger':
          this.item.icon = 'far fa-times-circle';
          break;
      }
    }
    super.ngOnInit();

    if (this.item.showTimer && this.item.duration) {
      const duration = this.item.duration;
      const startTime = new Date().getTime();
      const interval = setInterval(() => {
        this.timer = duration - (new Date().getTime() - startTime);
        if (this.timer < 0) {
          this.timer = 0;
          clearInterval(interval);
        }
      }, this.item.timerInterval ?? 30);
    }
  }

  remove() {
    this.onRemove.emit(this.item);
  }
}
