import {NgModule} from '@angular/core';

import {DialogComponent} from './components/dialog/dialog.component';
import {CommonModule} from "@angular/common";
import {DialogContainerComponent} from "./dialog-container.component";
import {PositionModule} from "../position/position.module";
import {ConfirmComponent} from "./components/confirm/confirm.component";
import {ButtonModule} from "../button/button.module";
import {PromptComponent} from "./components/prompt/prompt.component";
import {ControlGroupModule, InputModule} from "../form";
import {TranslateModule} from "@ngx-translate/core";

export * from './services/dialog.service';
export * from './dialog-container.component';
export * from './components/confirm/confirm.component';
export * from './components/prompt/prompt.component';
export * from './components/dialog/dialog.component';

@NgModule({
  imports: [CommonModule, PositionModule, ButtonModule, InputModule, ControlGroupModule, TranslateModule],
  declarations: [DialogComponent, DialogContainerComponent, ConfirmComponent, PromptComponent],
  exports: [DialogContainerComponent],
  providers: [],
})
export class DialogModule {
}
