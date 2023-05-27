import {
  Component, ContentChildren, HostListener, Injector, Input, QueryList, SimpleChanges, TemplateRef,
} from '@angular/core';
import {BaseComponent} from "../base.component";
import {TemplateDirective} from "../template/template.directive";
import {MessageService} from "./services/message.service";
import {Subscription} from "rxjs";
import {Message} from "./models";
import {Positions} from "../../types";

export * from './models';
export * from './services/message.service';
export * from './components/message/message.component';

@Component({
  selector: 'd-message-container',
  templateUrl: 'message-container.component.html',
  styleUrls: ['./message-container.component.scss']
})
export class MessageContainerComponent extends BaseComponent {
  @Input() name?: string;
  @Input() items: Message[] = [];
  @Input() position: 'static' | Positions  = 'static';

  @HostListener('mouseenter')
  onMouseEnter() {
    this.timerEnable = false;
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    this.timerEnable = true;
  }

  contentTemplate?: TemplateRef<any>;

  @ContentChildren(TemplateDirective) set templates(value: QueryList<TemplateDirective>) {
    this.contentTemplate = value.find(x => x.includesName('default', true))?.template;
  }

  timerEnable: boolean = true;
  private listenSubscription?: Subscription;

  constructor(injector: Injector, private messageService: MessageService) {
    super(injector);
  }

  override ngOnInit() {
    super.ngOnInit();

    this.listenSubscription?.unsubscribe();
    this.listenSubscription = this.messageService.listen(this.name, (m) => {
      if (!this.items) this.items = [];
      if (m.delay) {
        setTimeout(() => {
          this.addMessage(m);
        }, m.delay)
      } else {
        this.addMessage(m);
      }
    });
  }

  override ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);
  }

  override render() {
    super.render();

    this.classes[this.position] = true;
    if (this.position !== 'static') {
      this.classes['fix'] = true;
    }
  }

  addMessage(m: Message) {
    this.items.push(m);
  }
}
