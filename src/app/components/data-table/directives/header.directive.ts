import {ContentChildren, Directive, QueryList, ViewChildren} from "@angular/core";
import {TemplateDirective} from "../../../directives/template/index.directive";
import {DataTableFilterDirective} from "./filter.directive";

@Directive({
  selector: '[devTemplate=header]'
})
export class HeaderDirective extends TemplateDirective {

  @ContentChildren(DataTableFilterDirective)
  set filters(value: QueryList<DataTableFilterDirective>) {
    console.log(value)
  }
}
