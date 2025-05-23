import {Injector} from "@angular/core";
import {Observable} from "rxjs";
import {ODataQueryOptions} from "../contracts/odata-query-options";
import {BaseApiRepository, IApiRepository} from "./base-api.repository";
import {PagedListResult, QueryResult} from "../contracts/results";

export interface IViewRepository<T> extends IApiRepository  {
    select(query?: ODataQueryOptions | any): Observable<PagedListResult<T>>;
    getAll(): Observable<QueryResult<T[]>>;
    getById(id: any): Observable<QueryResult<T>>;
}

export abstract class BaseReadRepository<T = any> extends BaseApiRepository implements IViewRepository<T> {

  constructor(injector: Injector, baseUrl: string, repository: string) {
    super(injector, baseUrl, repository);
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

  getById(id: any): Observable<QueryResult<T>> {
    return this.http.get<QueryResult<T>>(`${id}`);
  }
}
