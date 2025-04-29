import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {TableComponent} from "./table.component";
import {TableFilterComponent} from "./components/filter/filter.component";
import {TableRowExpanderComponent} from "./components/row-expander/row-expander.component";
import {TableSortDirective} from "./components/sort.directive";
import {TableTemplateDirective} from "./components/table-template.directive";
import {ResponsiveDirective} from "../../directives/responsive.directive";
import {InputComponent} from "../form/input/input.component";
import {PaginatorComponent} from "../paginator/paginator.component";
import {TemplateDirective} from "../../directives/template.directive";
import {SelectComponent} from "../form/select/select.component";

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

        TemplateDirective,
        SelectComponent,
        PaginatorComponent,
        InputComponent,
        ResponsiveDirective
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

        TemplateDirective,
    ],
})
export class TableModule {
}
