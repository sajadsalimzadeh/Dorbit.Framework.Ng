import {Injector} from "@angular/core";
import {BaseReadRepository} from "./base-read.repository";
import {Observable} from "rxjs";
import {QueryResult} from "../contracts/command-result";

export interface IAddRepository {
    add(request: any): Observable<QueryResult>;
}

export interface IEditRepository {
    edit(id: any, request: any): Observable<QueryResult>;
}

export interface ISaveRepository {
    save(id: any, request: any): Observable<QueryResult>;
}


export abstract class BaseWriteRepository<T = any> extends BaseReadRepository<T> implements ISaveRepository, IEditRepository, IAddRepository {

    constructor(injector: Injector, repository: string) {
        super(injector, repository);
    }

    add(request: any) {
        return this.http.post<QueryResult<T>>(``, request);
    }

    edit(id: any, req: any) {
        return this.http.patch<QueryResult<T>>(`${id}`, req);
    }

    save(id: any, req: any) {
        if (!id) {
            if (!req.id) {
                delete req.id;
            }
            return this.add(req);
        } else {
            return this.edit(id, {...req});
        }
    }

    remove(id: any) {
        return this.http.delete<QueryResult<T>>(`${id}`);
    }
}
