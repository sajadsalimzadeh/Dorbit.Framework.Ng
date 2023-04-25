import {Injectable} from "@angular/core";
import {ODataQueryOptions, PagedListResult, QueryResult} from "../models";
import {HttpService} from "./http.service";

@Injectable({providedIn: 'root'})
export abstract class CrudService<T = any> extends HttpService {
  protected abstract repository: string;

  select(query?: ODataQueryOptions, own?: boolean) {
    if (!query) query = new ODataQueryOptions();
    return this.http.get<PagedListResult<T>>(`${this.baseUrl}/${this.repository}${own ? '/Own' : ''}${query.toQueryString()}`);
  }

  getById(id: number) {
    return this.http.get<QueryResult<any>>(`${this.baseUrl}/${this.repository}/${id}`);
  }

  add(dto: any) {
    return this.http.post<QueryResult<T>>(`${this.baseUrl}/${this.repository}`, dto);
  }

  edit(id: number, dto: any) {
    return this.http.patch<QueryResult<T>>(`${this.baseUrl}/${this.repository}/${id}`, dto);
  }

  remove(id: number) {
    return this.http.delete<QueryResult<T>>(`${this.baseUrl}/${this.repository}/${id}`);
  }
}
