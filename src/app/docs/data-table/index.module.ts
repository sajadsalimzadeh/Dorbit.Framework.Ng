import {NgModule} from "@angular/core";
import {RouterModule} from "@angular/router";
import {IndexComponent} from "./index.component";
import {DataTableModule} from "../../components/data-table/index.module";
import {CommonModule} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild([{path: '', component: IndexComponent}]),

    DataTableModule,
  ],
  declarations: [
    IndexComponent
  ]
})
export class Module {

}
