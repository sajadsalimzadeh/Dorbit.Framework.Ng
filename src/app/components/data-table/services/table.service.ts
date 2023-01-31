import {Injectable} from "@angular/core";
import {DataTableFilterDirective} from "../directives/filter.directive";


@Injectable()
export class TableService {
  filters: { [key: number]: DataTableFilterDirective } = {};
}
