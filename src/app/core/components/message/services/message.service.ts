import {Injectable} from "@angular/core";
import {Subject} from "rxjs";
import {Message} from "../models";


@Injectable({providedIn: 'root'})
export class MessageService {
  private onMessage = new Subject<Message>();

  show(message: Message) {
    this.onMessage.next(message);
  }

  listen(scope: string | undefined, action: (message: Message) => void) {
    return this.onMessage.subscribe((message) => {
      if(scope == message.scope) {
        action(message);
      }
    })
  }
}
