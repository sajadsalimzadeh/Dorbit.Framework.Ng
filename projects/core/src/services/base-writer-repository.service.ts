import {Injectable, Injector} from "@angular/core";
import {ODataQueryOptions, PagedListResult, QueryResult} from "../contracts";
import {BaseApiRepository} from "./base-api-repository.service";
import {BaseReadRepository} from "./base-reader-repository.service";

@Injectable({providedIn: 'root'})
export abstract class BaseWriteRepository<T = any> extends BaseReadRepository {

  constructor(injector: Injector, repository: string) {
    super(injector, repository);
  }

  add(request: any) {
    return this.http.post<QueryResult<T>>(``, request);
  }

  edit(id: any, request: any) {
    return this.http.patch<QueryResult<T>>(`${id}`, request);
  }

  remove(id: number) {
    return this.http.delete<QueryResult<T>>(`${id}`);
  }
}
