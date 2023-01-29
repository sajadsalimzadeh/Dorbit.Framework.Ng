import {NgModule} from "@angular/core";
import {DataTableComponent} from "./index.component";
import {CommonModule} from "@angular/common";
import {TemplateModule} from "../../directives/template/index.directive";
import {FilterComponent} from "./components/filter.component";
import {DataTableSortDirective} from "./directives/sort.directive";
import {DataTableFilterDirective} from "./directives/filter.directive";
import {HeaderDirective} from "./directives/header.directive";
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
    FilterComponent,
    HeaderDirective,
  ],
  exports: [
    DataTableComponent,
    DataTableFilterDirective,
    DataTableSortDirective,
    FilterComponent,
    HeaderDirective,
  ]
})
export class DataTableModule {}
