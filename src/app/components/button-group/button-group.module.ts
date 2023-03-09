import {NgModule} from '@angular/core';

import {ButtonGroupComponent} from './button-group.component';
import {CommonModule} from "@angular/common";

@NgModule({
  imports: [CommonModule],
  declarations: [ButtonGroupComponent],
  exports: [ButtonGroupComponent],
  providers: [],
})
export class ButtonGroupModule {
}
