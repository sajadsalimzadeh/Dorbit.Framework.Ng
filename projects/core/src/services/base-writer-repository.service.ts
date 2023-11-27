import {Injectable, Injector} from "@angular/core";
import {ODataQueryOptions, PagedListResult, QueryResult} from "../contracts";
import {BaseApiRepository} from "./base-api-repository.service";
import {BaseReaderRepository} from "./base-reader-repository.service";

@Injectable({providedIn: 'root'})
export abstract class BaseWriterRepository<T = any> extends BaseReaderRepository {

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
