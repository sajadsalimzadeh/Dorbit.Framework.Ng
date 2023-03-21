import {NgModule} from '@angular/core';

import {DialogComponent} from './dialog.component';
import {CommonModule} from "@angular/common";

@NgModule({
  imports: [CommonModule],
  declarations: [DialogComponent],
  exports: [DialogComponent],
  providers: [],
})
export class DialogModule {
}
