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

    select<TReturn = T>(query?: ODataQueryOptions | any): Observable<PagedListResult<TReturn>> {
        if (!query) query = new ODataQueryOptions();
        let url = 'odata';
        let params = {};
        if (query instanceof ODataQueryOptions) {
            url += query.toQueryString();
        } else {
            params = query;
        }
        return this.http.get<PagedListResult<TReturn>>(url, { params: params, headers: { 'Content-Type': 'application/json' } });
    }

    getAll<TReturn = T>(): Observable<QueryResult<TReturn[]>> {
        return this.http.get<QueryResult<TReturn[]>>('');
    }

    getById<TReturn = T>(id: any): Observable<QueryResult<TReturn>> {
        return this.http.get<QueryResult<TReturn>>(`${id}`);
    }

    add<TReturn = T>(req: any) {
        return this.http.post<QueryResult<TReturn>>(``, req);
    }

    edit<TReturn = T>(id: any, req: any) {
        return this.http.patch<QueryResult<TReturn>>(`${id}`, req);
    }

    save<TReturn = T>(req: TSave) {
        if ((req as any).id) {
            return this.edit<TReturn>((req as any).id, { ...req });
        }
        delete (req as any).id;
        return this.add<TReturn>(req);
    }

    delete<TReturn = T>(id: any) {
        return this.http.delete<QueryResult<TReturn>>(`${id}`);
    }
}
