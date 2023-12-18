import {NgModule} from '@angular/core';

import {DialogComponent} from './components/dialog/dialog.component';
import {CommonModule} from "@angular/common";
import {DialogContainerComponent} from "./dialog-container.component";
import {PositionModule} from "../position/position.module";
import {ConfirmComponent} from "./components/confirm/confirm.component";
import {ButtonModule} from "../button/button.module";

export * from './services/dialog.service';
export * from './dialog-container.component';
export * from './components/dialog/dialog.component';

@NgModule({
  imports: [CommonModule, PositionModule, ButtonModule],
  declarations: [DialogComponent, DialogContainerComponent, ConfirmComponent],
  exports: [DialogContainerComponent],
  providers: [],
})
export class DialogModule {
}
