import { Injectable, Injector } from "@angular/core";
import { BaseApiRepository } from "./base-api.repository";
import { BASE_API_URL_FRAMEWORK } from '../configs';
import { CommandResult, QueryResult } from '../contracts/results';

@Injectable({providedIn: 'root'})
export class SystemRepository extends BaseApiRepository {
    constructor(injector: Injector) {
        super(injector, injector.get(BASE_API_URL_FRAMEWORK), 'System');
    }

    getAllKey() {
        return this.http.get<QueryResult<string[]>>(`MemoryCache`);
    }

    delete(key: string) {
        return this.http.delete<CommandResult>(`MemoryCache/${key}`);
    }

    clear() {
        return this.http.delete<CommandResult>(`MemoryCache`);
    }   
}