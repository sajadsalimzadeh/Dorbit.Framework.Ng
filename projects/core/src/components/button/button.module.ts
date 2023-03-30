import {NgModule} from '@angular/core';

import {ButtonComponent} from './button.component';
import {CommonModule} from "@angular/common";

export * from './button.component';

@NgModule({
  imports: [CommonModule],
  declarations: [ButtonComponent],
  exports: [ButtonComponent],
  providers: [],
})
export class ButtonModule {
}
