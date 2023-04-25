import {NgModule} from '@angular/core';

import {DialogComponent} from './components/dialog/dialog.component';
import {CommonModule} from "@angular/common";
import {DialogContainerComponent} from "./dialog-container.component";

export * from './services/dialog.service';
export * from './components/dialog/dialog.component';

@NgModule({
  imports: [CommonModule],
  declarations: [DialogComponent,DialogContainerComponent],
  exports: [DialogContainerComponent],
  providers: [],
})
export class DialogModule {
}
