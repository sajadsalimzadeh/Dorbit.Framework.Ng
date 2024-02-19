import {Injectable, Injector} from "@angular/core";
import {ODataQueryOptions, PagedListResult, QueryResult} from "../contracts";
import {BaseApiRepository} from "./base-api.repository";

@Injectable({providedIn: 'root'})
export abstract class BaseReadRepository<T = any> extends BaseApiRepository {

  constructor(injector: Injector, repository: string) {
    super(injector, repository);
  }

  select(query?: ODataQueryOptions | any) {
    if (!query) query = new ODataQueryOptions();
    let url = '';
    let params = {};
    if (query instanceof ODataQueryOptions) {
      url += query.toQueryString();
    } else {
      params = query;
    }
    return this.http.get<PagedListResult<T>>(url, {params: params, headers: {'Content-Type': 'application/json'}});
  }

  getAll() {
    return this.select(new ODataQueryOptions());
  }

  getById(id: any) {
    return this.http.get<QueryResult>(`${id}`);
  }
}
