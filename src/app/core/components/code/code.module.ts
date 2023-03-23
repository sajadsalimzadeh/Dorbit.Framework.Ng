import {NgModule} from '@angular/core';

import {CodeComponent} from './code.component';
import {CommonModule} from "@angular/common";
import {HighlightPlusModule} from "ngx-highlightjs/plus";

@NgModule({
  imports: [CommonModule,HighlightPlusModule],
  declarations: [CodeComponent],
  exports: [CodeComponent],
})
export class CodeModule {
}
