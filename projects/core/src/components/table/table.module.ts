import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {TableComponent} from "./table.component";
import {SelectModule} from "../form/select/select.module";
import {PaginatorModule} from "../paginator/paginator.module";
import {TableFilterComponent} from "./components/filter/filter.component";
import {TableRowExpanderComponent} from "./components/row-expander/row-expander.component";
import {TemplateModule} from "../template/template.directive";
import {TableSortDirective} from "./components/sort.directive";
import {TableTemplateDirective} from "./components/table-template.directive";
import {InputModule} from "../form/input/input.module";
import {ResponsiveDirectiveModule} from "../responsive/responsive.directive";

export * from './models';
export * from './table.component';
export * from './components/sort.directive';
export * from './components/filter/filter.component';
export * from './components/table-template.directive';
export * from './components/row-expander/row-expander.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,

        TemplateModule,
        SelectModule,
        PaginatorModule,
        InputModule,
      ResponsiveDirectiveModule
    ],
  declarations: [
    TableComponent,
    TableTemplateDirective,
    TableRowExpanderComponent,
    TableFilterComponent,
    TableSortDirective,
  ],
  exports: [
    TableComponent,
    TableTemplateDirective,
    TableRowExpanderComponent,
    TableFilterComponent,
    TableSortDirective,

    TemplateModule,
  ],
})
export class TableModule {
}
