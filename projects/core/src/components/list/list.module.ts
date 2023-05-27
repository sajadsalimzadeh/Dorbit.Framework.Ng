import {NgModule} from '@angular/core';

import {ListComponent} from './list.component';
import {CommonModule} from "@angular/common";

export * from './list.component';

@NgModule({
  imports: [CommonModule],
  declarations: [ListComponent],
  exports: [ListComponent],
  providers: [],
})
export class ListModule {
}
