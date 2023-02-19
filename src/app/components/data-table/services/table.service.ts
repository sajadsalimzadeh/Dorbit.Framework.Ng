import {Injectable} from "@angular/core";
import {DataTableComponent} from "../index.component";
import {DataTableFilterComponent} from "../components/filter/filter.component";
import {Subject} from "rxjs";
import {SortFunc} from "../models";

@Injectable()
export class TableService {
  dataTable!: DataTableComponent;
  filters: { [key: string]: DataTableFilterComponent } = {};

  onFilterChange = new Subject();
  onSortChange = new Subject<string | SortFunc>();

  get config() { return this.dataTable.config; }
}
