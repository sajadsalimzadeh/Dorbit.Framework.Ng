import {NgModule} from '@angular/core';
import {CommonModule} from "@angular/common";

import {RateComponent} from './rate.component';

export * from './rate.component';

@NgModule({
  imports: [CommonModule],
  declarations: [RateComponent],
  exports: [RateComponent],
  providers: [],
})
export class RateModule {
}
