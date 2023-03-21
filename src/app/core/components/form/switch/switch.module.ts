import {NgModule} from '@angular/core';

import {SwitchComponent} from './switch.component';
import {CommonModule} from "@angular/common";

@NgModule({
  imports: [CommonModule],
  declarations: [SwitchComponent],
  exports: [SwitchComponent],
  providers: [],
})
export class SwitchModule {
}
