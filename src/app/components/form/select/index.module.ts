import {NgModule} from "@angular/core";
import {SelectComponent} from "./index.component";
import {CommonModule} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  declarations: [
    SelectComponent,
  ],
  exports: [
    SelectComponent,
  ]
})
export class SelectModule {}
