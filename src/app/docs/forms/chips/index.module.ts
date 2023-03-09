import {NgModule} from "@angular/core";
import {RouterModule} from "@angular/router";
import {IndexComponent} from "./index.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {DevModule} from "../../../dev.module";

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild([{path: '', component: IndexComponent}]),

    DevModule,
  ],
  declarations: [
    IndexComponent
  ]
})
export class Module {

}
