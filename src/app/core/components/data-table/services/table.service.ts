import {Injectable} from "@angular/core";
import {DataTableComponent} from "../index.component";
import {DataTableFilterComponent} from "../components/filter/filter.component";
import {Subject} from "rxjs";
import {SortEvent} from "../directives/sort.directive";

@Injectable()
export class TableService {
  dataTable!: DataTableComponent;
  filters: DataTableFilterComponent[] = [];

  onFilterChange = new Subject();
  onSortChange = new Subject<SortEvent>();

  get config() { return this.dataTable.config; }
}
