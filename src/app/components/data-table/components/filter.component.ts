import {Component, Input, OnChanges, SimpleChanges, TemplateRef} from "@angular/core";
import {DataTableFilterDirective} from "../directives/filter.directive";


@Component({
  selector: 'dev-table-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements OnChanges {
  @Input() filter!: DataTableFilterDirective;

  template?: TemplateRef<any>;

  ngOnChanges(changes: SimpleChanges): void {
    // this.template = this.filter?.template;
    // console.log(this.filter)
  }
}
