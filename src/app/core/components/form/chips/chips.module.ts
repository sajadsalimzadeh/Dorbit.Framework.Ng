import {NgModule} from "@angular/core";
import {ChipsComponent} from "./chips.component";
import {CommonModule} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  declarations: [
    ChipsComponent,
  ],
  exports: [
    ChipsComponent,
  ]
})
export class ChipsModule {}
