import {NgModule} from "@angular/core";
import {DataTableComponent} from "./index.component";
import {CommonModule} from "@angular/common";
import {TemplateModule} from "../../directives/template/template.directive";
import {DataTableSortDirective} from "./directives/sort.directive";
import {DataTableFilterDirective} from "./directives/filter.directive";
import {SelectModule} from "../form/select/index.module";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    TemplateModule,
    SelectModule,
  ],
  declarations: [
    DataTableComponent,
    DataTableFilterDirective,
    DataTableSortDirective,
  ],
  exports: [
    DataTableComponent,
    DataTableFilterDirective,
    DataTableSortDirective,
  ]
})
export class DataTableModule {}
