import { Injectable, Injector } from "@angular/core";
import { BaseApiRepository } from "./base-api.repository";
import { BASE_API_URL_FRAMEWORK } from '../configs';
import { CommandResult, QueryResult } from '../contracts/results';

@Injectable({providedIn: 'root'})
export class SystemRepository extends BaseApiRepository {
    constructor(injector: Injector) {
        super(injector, injector.get(BASE_API_URL_FRAMEWORK), 'System');
    }

    memoryCacheGetAllKey() {
        return this.http.get<QueryResult<string[]>>(`MemoryCache/Keys`);
    }

    memoryCacheDeleteByKey(key: string) {
        return this.http.post<CommandResult>(`MemoryCache/Delete/${key}`, {});
    }

    memoryCacheClear() {
        return this.http.post<CommandResult>(`MemoryCache/Clear`, {});
    }   
}