import {NgModule} from '@angular/core';

import {TreeComponent} from './tree.component';
import {CommonModule} from "@angular/common";

@NgModule({
  imports: [CommonModule],
  declarations: [TreeComponent],
  exports: [TreeComponent],
  providers: [],
})
export class TreeModule {
}
