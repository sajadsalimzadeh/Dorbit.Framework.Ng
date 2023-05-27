import {Injectable} from "@angular/core";
import {TableComponent} from "../table.component";
import {TableFilterComponent} from "../components/filter/filter.component";
import {Subject} from "rxjs";
import {SortEvent} from "../directives/sort.directive";
import {TableConfig} from "../models";

@Injectable()
export class TableService {
  dataTable!: TableComponent;
  filters: TableFilterComponent[] = [];

  onFilterChange = new Subject();
  onSortChange = new Subject<SortEvent>();

  get config(): TableConfig { return this.dataTable.config; }
}
