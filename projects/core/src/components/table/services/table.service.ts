import {Injectable} from "@angular/core";
import {Subject} from "rxjs";
import {TableComponent} from "../table.component";
import {SortEvent} from "../components/sort.directive";
import {TableFilterComponent} from "../components/filter/filter.component";
import {TableConfig} from "../models";

@Injectable()
export class TableService {
  dataTable!: TableComponent;
  filters: TableFilterComponent[] = [];

  onFilterChange = new Subject();
  onSortChange = new Subject<SortEvent>();

  get config(): TableConfig { return this.dataTable.config; }
}
