import {NgModule} from '@angular/core';

import {ShimmerComponent} from './shimmer.component';
import {CommonModule} from "@angular/common";

export * from './shimmer.component';

@NgModule({
  imports: [CommonModule],
  declarations: [ShimmerComponent],
  exports: [ShimmerComponent],
  providers: [],
})
export class ShimmerModule {
}
