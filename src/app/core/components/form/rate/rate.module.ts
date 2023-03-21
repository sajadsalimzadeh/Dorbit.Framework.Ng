import {NgModule} from '@angular/core';

import {RateComponent} from './rate.component';
import {CommonModule} from "@angular/common";

@NgModule({
  imports: [CommonModule],
  declarations: [RateComponent],
  exports: [RateComponent],
  providers: [],
})
export class RateModule {
}
