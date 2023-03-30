import {NgModule} from '@angular/core';

import {ColorPickerComponent} from './color-picker.component';
import {CommonModule} from "@angular/common";

export * from './color-picker.component';

@NgModule({
  imports: [CommonModule],
  declarations: [ColorPickerComponent],
  exports: [ColorPickerComponent],
  providers: [],
})
export class ColorPickerModule {
}
