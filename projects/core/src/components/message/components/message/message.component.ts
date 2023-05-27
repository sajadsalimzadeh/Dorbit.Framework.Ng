import {
  Component,
  ContentChildren,
  EventEmitter,
  HostBinding,
  Injector,
  Input, Output,
  QueryList,
  TemplateRef,
} from '@angular/core';
import {TemplateDirective} from "../../../template/template.directive";
import {BaseComponent} from "../../../base.component";
import {Message} from "../../models";

@Component({
  selector: 'd-message',
  templateUrl: 'message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent extends BaseComponent {
  @Input() item!: Message;
  @Input() items!: Message[];
  @Input() timerEnable: boolean = true;

  @Output() onRemove = new EventEmitter<Message>();

  @HostBinding('class.show')
  get show() {
    return this.item.show;
  }

  timer: number = 0;
  progress: number = 0;

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
    this.item.show = true;

    super.ngOnInit();

    if (this.item.duration) {
      const duration = this.item.duration;
      if (this.item.showTimer) {
        this.timer = this.item.duration;
        const speed = 50;
        const interval = setInterval(() => {
          if (!this.timerEnable) return;
          this.timer -= speed;
          this.progress = (this.timer * 100 / duration);
          if (this.timer < 0) {
            this.timer = 0;
            this.remove();
            clearInterval(interval);
          }
        }, this.item.timerInterval ?? speed);
      } else {
        setTimeout(() => {
          this.remove();
        }, this.item.duration);
      }
    }
  }

  remove() {
    this.item.show = false;
    setTimeout(() => {
      const index = this.items.indexOf(this.item);
      if (index > -1) this.items.splice(index, 1);
    }, 200);
  }
}
