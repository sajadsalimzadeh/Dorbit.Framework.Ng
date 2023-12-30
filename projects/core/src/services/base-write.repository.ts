import {Injectable, Injector} from "@angular/core";
import {QueryResult} from "../contracts";
import {BaseReadRepository} from "./base-read.repository";

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
