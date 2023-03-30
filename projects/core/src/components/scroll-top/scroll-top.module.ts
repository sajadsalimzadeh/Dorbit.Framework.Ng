import {NgModule} from '@angular/core';

import {ScrollTopComponent} from './scroll-top.component';
import {CommonModule} from "@angular/common";

export * from './scroll-top.component';

@NgModule({
  imports: [CommonModule],
  declarations: [ScrollTopComponent],
  exports: [ScrollTopComponent],
  providers: [],
})
export class ScrollTopModule {
}
