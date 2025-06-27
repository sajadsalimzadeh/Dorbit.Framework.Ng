import {Inject, Injectable, Injector} from '@angular/core';
import {CommandResult, QueryResult} from "../contracts/results";
import {BaseApiRepository} from './base-api.repository';
import {map, Observable} from 'rxjs';
import {BASE_URL_FRAMEWORK} from '@framework/configs';

@Injectable({providedIn: 'root'})
export class SettingRepository extends BaseApiRepository {

    constructor(injector: Injector) {
        super(injector, injector.get(BASE_URL_FRAMEWORK), 'Settings');
    }

    get(key: string): Observable<QueryResult<any>> {
        return this.http.get<QueryResult<any>>(`${key}`);
    }

    getAll(keys: string[] = []) {
        return this.http.get<QueryResult<{[key: string]: any}>>(``, {params: {keys}});
    }

    saveAll(values: any) {
        return this.http.post<CommandResult>(``, values);
    }
}
