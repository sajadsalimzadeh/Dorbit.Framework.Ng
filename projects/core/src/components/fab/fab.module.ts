import {NgModule} from '@angular/core';

import {FabComponent} from './fab.component';
import {CommonModule} from "@angular/common";
import {ButtonModule} from "../button/button.module";
import {PositionModule} from "../position/position.module";

export * from './fab.component';

@NgModule({
  imports: [CommonModule, ButtonModule, PositionModule],
  declarations: [FabComponent],
  exports: [FabComponent],
  providers: [],
})
export class FabModule {
}
