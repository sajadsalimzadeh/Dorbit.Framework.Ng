import {Injectable, Injector} from "@angular/core";
import {ODataQueryOptions, PagedListResult, QueryResult} from "../contracts";
import {BaseApiRepository} from "./base-api.repository";

@Injectable({providedIn: 'root'})
export abstract class BaseReadRepository<T = any> extends BaseApiRepository {

  constructor(injector: Injector, repository: string) {
    super(injector, repository);
  }

  select(query?: ODataQueryOptions) {
    if (!query) query = new ODataQueryOptions();
    return this.http.get<PagedListResult<T>>(`${query.toQueryString()}`);
  }

  getAll() {
    return this.select(new ODataQueryOptions());
  }

  getById(id: number) {
    return this.http.get<QueryResult>(`${id}`);
  }
}
