import {Injectable} from "@angular/core";
import {Subject} from "rxjs";
import {Message} from "../models";


@Injectable({providedIn: 'root'})
export class MessageService {
  private onMessage = new Subject<Message>();

  defaultOptions?: Message;
  primaryOptions?: Message;
  secondaryOptions?: Message;
  successOptions?: Message;
  warningOptions?: Message;
  dangerOptions?: Message;
  linkOptions?: Message;

  show(message: Message) {
    message = {...this.defaultOptions, ...message};
    if(message.color?.includes('primary')) message = {...this.primaryOptions, ...message};
    if(message.color?.includes('secondary')) message = {...this.secondaryOptions, ...message};
    if(message.color?.includes('success')) message = {...this.successOptions, ...message};
    if(message.color?.includes('warning')) message = {...this.warningOptions, ...message};
    if(message.color?.includes('danger')) message = {...this.dangerOptions, ...message};
    if(message.color?.includes('link')) message = {...this.linkOptions, ...message};
    this.onMessage.next({...this.defaultOptions, ...message});
  }

  listen(container: string | undefined, action: (message: Message) => void) {
    return this.onMessage.subscribe((message) => {
      if(container == message.container) {
        action(message);
      }
    })
  }
}
