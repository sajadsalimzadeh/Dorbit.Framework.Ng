import {Injectable, Injector} from "@angular/core";
import {ODataQueryOptions, PagedListResult, QueryResult} from "../contracts";
import {BaseApiRepository} from "./base-api-repository.service";

@Injectable({providedIn: 'root'})
export abstract class BaseReadRepository<T = any> extends BaseApiRepository {

  constructor(injector: Injector, repository: string) {
    super(injector, repository);
  }

  select(query?: ODataQueryOptions, own?: boolean) {
    if (!query) query = new ODataQueryOptions();
    return this.http.get<PagedListResult<T>>(`${own ? '/Own' : ''}${query.toQueryString()}`);
  }

  getAll() {
    return this.select(new ODataQueryOptions());
  }

  getById(id: number) {
    return this.http.get<QueryResult<any>>(`${id}`);
  }
}
