import {NgModule} from '@angular/core';

import {TagComponent} from './tag.component';
import {CommonModule} from "@angular/common";

export * from './tag.component';

@NgModule({
  imports: [CommonModule],
  declarations: [TagComponent],
  exports: [TagComponent],
  providers: [],
})
export class TagModule {
}
