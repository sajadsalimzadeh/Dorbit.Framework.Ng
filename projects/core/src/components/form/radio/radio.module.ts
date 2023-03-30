import {NgModule} from '@angular/core';

import {RadioComponent} from './radio.component';
import {CommonModule} from "@angular/common";

export * from './radio.component';

@NgModule({
  imports: [CommonModule],
  declarations: [RadioComponent],
  exports: [RadioComponent],
  providers: [],
})
export class RadioModule {
}
