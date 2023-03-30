import {NgModule} from '@angular/core';

import {DialogComponent} from './dialog.component';
import {CommonModule} from "@angular/common";

export * from './dialog.service';
export * from './dialog.component';

@NgModule({
  imports: [CommonModule],
  declarations: [DialogComponent],
  exports: [DialogComponent],
  providers: [],
})
export class DialogModule {
}
