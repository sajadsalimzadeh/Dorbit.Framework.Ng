import {NgModule} from "@angular/core";
import {COMPONENTS} from "./components";
import {CommonModule} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
  ],
  declarations: [
    ...COMPONENTS
  ],
  exports: [
    ...COMPONENTS
  ]
})
export class DevModule {}
