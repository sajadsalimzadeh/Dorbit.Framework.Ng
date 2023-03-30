import {
  Component, ContentChildren, Injector, Input, QueryList, SimpleChanges, TemplateRef,
} from '@angular/core';
import {BaseComponent} from "../base.component";
import {TemplateDirective} from "../../directives";
import {MessageService} from "./services/message.service";
import {Subscription} from "rxjs";
import {Message} from "./models";
import {Positions} from "../../types";


export * from './models';
export * from './services/message.service';
export * from './components/message/message.component';

@Component({
  selector: 'd-messages',
  templateUrl: 'message.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent extends BaseComponent {
  @Input() scope?: string;
  @Input() items: Message[] = [];
  @Input() position: 'static' | Positions  = 'static';

  contentTemplate?: TemplateRef<any>;

  @ContentChildren(TemplateDirective) set templates(value: QueryList<TemplateDirective>) {
    this.contentTemplate = value.find(x => x.includesName('default', true))?.template;
  }

  private listenSubscription?: Subscription;

  constructor(injector: Injector, private messageService: MessageService) {
    super(injector);
  }

  override ngOnInit() {
    super.ngOnInit();

    this.listenSubscription?.unsubscribe();
    this.listenSubscription = this.messageService.listen(this.scope, (m) => {
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
    if (m.duration) {
      setTimeout(() => {
        this.removeMessage(m);
      }, m.duration);
    }
    m.show = true;
  }

  removeMessage(m: Message) {
    m.show = false;
    setTimeout(() => {
      this.items.splice(this.items.indexOf(m), 1);
    }, 200);
  }
}
