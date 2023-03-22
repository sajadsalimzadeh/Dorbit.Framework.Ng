import {NgModule} from '@angular/core';

import {TabComponent} from './tab.component';
import {CommonModule} from "@angular/common";
import {TemplateDirective} from "./directive/template.directive";

@NgModule({
  imports: [CommonModule],
  declarations: [TabComponent,TemplateDirective],
  exports: [TabComponent,TemplateDirective],
  providers: [],
})
export class TabModule {
}
