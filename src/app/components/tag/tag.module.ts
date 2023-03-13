import {NgModule} from '@angular/core';

import {TagComponent} from './tag.component';
import {CommonModule} from "@angular/common";

@NgModule({
  imports: [CommonModule],
  declarations: [TagComponent],
  exports: [TagComponent],
  providers: [],
})
export class TagModule {
}
