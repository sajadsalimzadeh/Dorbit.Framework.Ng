import {ChangeDetectorRef, Component, ContentChildren, HostListener, Injector, Input, QueryList, TemplateRef} from '@angular/core';
import {TemplateDirective} from "../template/template.directive";
import {Message} from "./models";
import {Positions} from "../../types";
import {AbstractComponent} from "../abstract.component";
import {MessageService} from "./services/message.service";

export * from './models';
export * from './services/message.service';
export * from './components/message/message.component';

@Component({
  selector: 'd-message-container',
  templateUrl: 'message-container.component.html',
  styleUrls: ['./message-container.component.scss']
})
export class MessageContainerComponent extends AbstractComponent {
  @Input() name?: string;
  @Input() items: Message[] = [];
  @Input() position: 'static' | Positions = 'static';

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

  constructor(injector: Injector, private changeDetectionRef: ChangeDetectorRef, private messageService: MessageService) {
    super(injector);
  }

  override ngOnInit() {
    super.ngOnInit();

    this.subscription.add(this.messageService.onMessage.subscribe((message) => {
      if (this.name == message.container) {
        if (!this.items) this.items = [];
        if (message.delay) {
          setTimeout(() => {
            this.addMessage(message);
          }, message.delay)
        } else {
          this.addMessage(message);
        }
        this.changeDetectionRef.detectChanges();
      }
    }));
  }

  override render() {
    super.render();

    this.setClass(this.position, true);
    if (this.position !== 'static') {
      this.setClass('fix', true);
    }
  }

  addMessage(m: Message) {
    this.items.push(m);
  }
}
