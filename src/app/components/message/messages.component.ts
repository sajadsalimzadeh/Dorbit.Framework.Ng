import {
  Component, ContentChildren, Injector, Input, QueryList, SimpleChanges, TemplateRef,
} from '@angular/core';
import {BaseComponent} from "../base.component";
import {DevTemplateDirective} from "../../directives/template/dev-template.directive";
import {MessagesService} from "./messages.service";
import {Subscription} from "rxjs";
import {Message} from "./models";

@Component({
  selector: 'dev-messages',
  templateUrl: 'message.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent extends BaseComponent {
  @Input() scope?: string;
  @Input() items: Message[] = [];
  @Input() position: 'static' |
    'top-start' | 'top-center' | 'top-end' |
    'middle-start' | 'middle-center' | 'middle-end' |
    'bottom-start' | 'bottom-center' | 'bottom-end' = 'static';

  contentTemplate?: TemplateRef<any>;

  @ContentChildren(DevTemplateDirective) set templates(value: QueryList<DevTemplateDirective>) {
    this.contentTemplate = value.find(x => !x.name || x.name == 'content')?.template;
  }

  private listenSubscription?: Subscription;

  constructor(injector: Injector, private messageService: MessagesService) {
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
