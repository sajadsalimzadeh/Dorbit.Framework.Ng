import {NgModule} from '@angular/core';

import {TabComponent} from './tab.component';
import {CommonModule} from "@angular/common";
import {TabTemplateDirective} from "./directive/tab-template.directive";

export * from './tab.component';
export * from './directive/tab-template.directive';

@NgModule({
  imports: [CommonModule],
  declarations: [TabComponent,TabTemplateDirective],
  exports: [TabComponent,TabTemplateDirective],
  providers: [],
})
export class TabModule {
}
