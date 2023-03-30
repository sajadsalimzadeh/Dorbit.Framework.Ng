import {NgModule} from '@angular/core';

import {MessagesComponent} from './messages.component';
import {CommonModule} from "@angular/common";
import {DevTemplateModule} from "../../directives";
import {MessageComponent} from "./components/message/message.component";

export * from './models';
export * from './messages.component';
export * from './components/message/message.component';

@NgModule({
  imports: [CommonModule, DevTemplateModule],
  declarations: [MessagesComponent, MessageComponent],
  exports: [MessagesComponent, MessageComponent],
  providers: [],
})
export class MessagesModule {
}
