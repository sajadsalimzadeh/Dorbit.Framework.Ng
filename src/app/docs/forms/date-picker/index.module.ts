import {NgModule} from "@angular/core";
import {RouterModule} from "@angular/router";
import {IndexComponent} from "./index.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {DatePickerModule} from "src/app/components/form/date-picker/date-picker.module";

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild([{path: '', component: IndexComponent}]),

    DatePickerModule,
  ],
  declarations: [
    IndexComponent
  ]
})
export class Module {

}
