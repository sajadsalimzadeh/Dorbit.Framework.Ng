import {Injector} from "@angular/core";
import {ODataQueryOptions, PagedListResult, QueryResult} from "../contracts";
import {BaseApiRepository} from "./base-api.repository";
import {Observable} from "rxjs";

export abstract class BaseReadRepository<T = any> extends BaseApiRepository {

  constructor(injector: Injector, repository: string) {
    super(injector, repository);
  }

  select(query?: ODataQueryOptions | any): Observable<PagedListResult<T>> {
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

  getAll(): Observable<QueryResult<T[]>> {
    return this.select(new ODataQueryOptions().take(10000)) as Observable<QueryResult<T[]>>;
  }

  getById(id: any) {
    return this.http.get<QueryResult<T>>(`${id}`);
  }
}
