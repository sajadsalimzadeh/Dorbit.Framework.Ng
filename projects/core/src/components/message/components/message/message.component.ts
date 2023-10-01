import {ChangeDetectorRef, Component, ContentChildren, EventEmitter, Injector, Input, Output, QueryList, TemplateRef,} from '@angular/core';
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

  timer: number = 0;
  progress: number = 0;

  contentTemplate?: TemplateRef<any>;

  @ContentChildren(TemplateDirective) set templates(value: QueryList<TemplateDirective>) {
    this.contentTemplate = value.find(x => x.includesName('default', true))?.template;
  }

  constructor(injector: Injector, private changeDetectionRef: ChangeDetectorRef) {
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
          this.item.icon = 'icons-core-info-circle';
          break;
        case 'secondary':
          this.item.icon = 'icons-core-exclamation-circle';
          break;
        case 'warning':
          this.item.icon = 'icons-core-warning';
          break;
        case 'success':
          this.item.icon = 'icons-core-check';
          break;
        case 'link':
          this.item.icon = 'icons-core-link';
          break;
        case 'danger':
          this.item.icon = 'icons-core-close-circle';
          break;
      }
    }
    this.elementRef.nativeElement.classList.add('show');

    super.ngOnInit();

    if (this.item.duration) {
      const duration = this.item.duration;
      if (this.item.showTimer) {
        this.timer = this.item.duration;
        const progressEl = this.elementRef.nativeElement.querySelector('.progress') as HTMLElement;
        const speed = 50;
        const interval = setInterval(() => {
          if (!this.timerEnable) return;
          this.timer -= speed;
          this.progress = (this.timer * 100 / duration);
          progressEl.style.width = `${this.progress}%`;
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
    this.elementRef.nativeElement.classList.remove('show');
    this.changeDetectionRef.detectChanges();
    setTimeout(() => {
      const index = this.items.indexOf(this.item);
      if (index > -1) this.items.splice(index, 1);
      this.changeDetectionRef.detectChanges();
    }, 200);
  }
}
