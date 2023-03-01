import {NgModule} from "@angular/core";
import {RouterModule} from "@angular/router";
import {IndexComponent} from "./index.component";
import {CommonModule} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ButtonModule} from "../../components/button/button.module";

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild([{path: '', component: IndexComponent}]),

    ButtonModule,
  ],
  declarations: [
    IndexComponent
  ]
})
export class Module {

}
