import {NgModule} from '@angular/core';

import {CheckboxComponent} from './checkbox.component';
import {CommonModule} from "@angular/common";

@NgModule({
  imports: [CommonModule],
  declarations: [CheckboxComponent],
  exports: [CheckboxComponent],
  providers: [],
})
export class CheckboxModule {
}
