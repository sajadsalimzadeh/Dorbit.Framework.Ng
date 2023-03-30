import {NgModule} from '@angular/core';

import {SkeletonComponent} from './skeleton.component';
import {CommonModule} from "@angular/common";

export * from './skeleton.component';

@NgModule({
  imports: [CommonModule],
  declarations: [SkeletonComponent],
  exports: [SkeletonComponent],
  providers: [],
})
export class SkeletonModule {
}
