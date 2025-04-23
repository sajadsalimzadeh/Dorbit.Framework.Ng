import {NgModule} from '@angular/core';

import {CodeComponent} from './code.component';
import {CommonModule} from "@angular/common";
import {HighlightModule} from "ngx-highlightjs";
import {HighlightPlusModule} from "ngx-highlightjs/plus";

export * from './code.component';

@NgModule({
    imports: [CommonModule, HighlightModule, HighlightPlusModule],
    declarations: [CodeComponent],
    exports: [CodeComponent],
})
export class CodeModule {
}
