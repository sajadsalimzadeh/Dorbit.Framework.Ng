import {NgModule} from "@angular/core";
import {DataTableComponent} from "./index.component";
import {CommonModule} from "@angular/common";
import {DevTemplateDirective, DevTemplateModule} from "../../directives/template/dev-template.directive";
import {DataTableSortDirective} from "./directives/sort.directive";
import {SelectModule} from "../form/select/index.module";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {DataTableRowExpanderComponent} from "./components/row-expander/row-expander.component";
import {DataTableFilterComponent} from "./components/filter/filter.component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    DevTemplateModule,
    SelectModule,
  ],
  declarations: [
    DataTableComponent,
    DataTableRowExpanderComponent,
    DataTableFilterComponent,
    DataTableSortDirective,
  ],
  exports: [
    DataTableComponent,
    DataTableRowExpanderComponent,
    DataTableFilterComponent,
    DataTableSortDirective,

    DevTemplateModule,
  ]
})
export class DataTableModule {}
