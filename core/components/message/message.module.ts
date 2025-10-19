import {NgModule} from '@angular/core';
import {CommonModule} from "@angular/common";

import {MessageContainerComponent} from './message-container.component';
import {MessageComponent} from "./components/message/message.component";
import {TemplateDirective} from "../../directives/template.directive";

export * from './models';
export * from './message-container.component';
export * from './components/message/message.component';

@NgModule({
    imports: [CommonModule, TemplateDirective],
    declarations: [MessageContainerComponent, MessageComponent],
    exports: [MessageContainerComponent, MessageComponent],
    providers: [],
})
export class MessageModule {
}
