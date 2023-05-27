import {NgModule} from '@angular/core';

import {MessageContainerComponent} from './message-container.component';
import {CommonModule} from "@angular/common";
import {TemplateModule} from "../template/template.directive";
import {MessageComponent} from "./components/message/message.component";

export * from './models';
export * from './message-container.component';
export * from './components/message/message.component';

@NgModule({
  imports: [CommonModule, TemplateModule],
  declarations: [MessageContainerComponent, MessageComponent],
  exports: [MessageContainerComponent, MessageComponent],
  providers: [],
})
export class MessagesModule {
}
