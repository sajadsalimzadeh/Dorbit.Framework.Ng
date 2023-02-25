import {NgModule} from "@angular/core";
import {DataTableComponent} from "./index.component";
import {CommonModule} from "@angular/common";
import {TemplateDirective, TemplateModule} from "../../directives/template/template.directive";
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

    TemplateModule,
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

    TemplateModule,
  ]
})
export class DataTableModule {}
