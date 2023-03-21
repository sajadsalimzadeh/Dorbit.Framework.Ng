import {NgModule} from '@angular/core';

import {RadioComponent} from './radio.component';
import {CommonModule} from "@angular/common";

@NgModule({
  imports: [CommonModule],
  declarations: [RadioComponent],
  exports: [RadioComponent],
  providers: [],
})
export class RadioModule {
}
