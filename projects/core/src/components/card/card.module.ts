import {NgModule} from '@angular/core';

import {CardComponent} from './card.component';
import {CommonModule} from "@angular/common";

export * from './card.component';

@NgModule({
  imports: [CommonModule],
  declarations: [CardComponent],
  exports: [CardComponent],
  providers: [],
})
export class CardModule {
}
