import {NgModule} from '@angular/core';

import {PositionComponent} from './position.component';
import {CommonModule} from "@angular/common";

export * from './position.component';

@NgModule({
  imports: [CommonModule],
  declarations: [PositionComponent],
  exports: [PositionComponent],
  providers: [],
})
export class PositionModule {
}
