import {Injectable, Injector} from "@angular/core";
import {ODataQueryOptions, PagedListResult, QueryResult} from "../models";
import {BaseApiService} from "./base-api.service";

@Injectable({providedIn: 'root'})
export abstract class BaseCrudService<T = any> extends BaseApiService {

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

  add(dto: any) {
    return this.http.post<QueryResult<T>>(``, dto);
  }

  edit(id: number, dto: any) {
    return this.http.patch<QueryResult<T>>(`${id}`, dto);
  }

  remove(id: number) {
    return this.http.delete<QueryResult<T>>(`${id}`);
  }
}
