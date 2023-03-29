import {NgModule} from "@angular/core";
import {TableComponent} from "./table.component";
import {CommonModule} from "@angular/common";
import {DevTemplateModule} from "../../directives/template/template.directive";
import {DataTableSortDirective} from "./directives/sort.directive";
import {SelectModule} from "../form/select/select.module";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {DataTableRowExpanderComponent} from "./components/row-expander/row-expander.component";
import {DataTableFilterComponent} from "./components/filter/filter.component";
import {OverlayService} from "../overlay/overlay.service";
import { PaginatorModule } from "../paginator/paginator.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    DevTemplateModule,
    SelectModule,
    PaginatorModule,
  ],
  declarations: [
    TableComponent,
    DataTableRowExpanderComponent,
    DataTableFilterComponent,
    DataTableSortDirective,
  ],
  exports: [
    TableComponent,
    DataTableRowExpanderComponent,
    DataTableFilterComponent,
    DataTableSortDirective,

    DevTemplateModule,
  ],
  providers: [
    OverlayService
  ]
})
export class TableModule {}
