import { Injector } from "@angular/core";
import { Observable } from "rxjs";
import { PagedListResult, QueryResult } from "../contracts/results";
import { ODataQueryOptions } from '../contracts/odata-query-options';
import { BaseApiRepository } from './base-api.repository';

export interface IViewRepository<T = any> {
    select(query?: ODataQueryOptions | any): Observable<PagedListResult<T>>;

    getAll(): Observable<QueryResult<T[]>>;

    getById(id: any): Observable<QueryResult<T>>;
}

export interface IAddRepository {
    add(req: any): Observable<QueryResult>;
}

export interface IEditRepository {
    edit(id: any, req: any): Observable<QueryResult>;
}

export interface ISaveRepository {
    save(req: any): Observable<QueryResult>;
}

export abstract class BaseCrudRepository<T = any, TSave = any> extends BaseApiRepository implements IViewRepository<T>, IAddRepository, IEditRepository, ISaveRepository {

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
        return this.http.get<PagedListResult<T>>(url, { params: params, headers: { 'Content-Type': 'application/json' } });
    }

    getAll(): Observable<QueryResult<T[]>> {
        return this.select(new ODataQueryOptions().take(10000)) as Observable<QueryResult<T[]>>;
    }

    getById(id: any): Observable<QueryResult<T>> {
        return this.http.get<QueryResult<T>>(`${id}`);
    }

    add(req: any) {
        return this.http.post<QueryResult<T>>(``, req);
    }

    edit(id: any, req: any) {
        return this.http.patch<QueryResult<T>>(`${id}`, req);
    }

    save(req: TSave) {
        if ((req as any).id) {
            return this.edit((req as any).id, { ...req });
        }
        delete (req as any).id;
        return this.add(req);
    }

    delete(id: any) {
        return this.http.delete<QueryResult<T>>(`${id}`);
    }
}
