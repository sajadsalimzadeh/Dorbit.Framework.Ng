import {Inject, Injectable, Injector} from '@angular/core';
import {CommandResult, QueryResult} from "../contracts/results";
import {BaseApiRepository} from './base-api.repository';
import {Setting} from "../contracts/setting";
import {map, Observable} from 'rxjs';
import {BASE_URL_FRAMEWORK} from '@framework/configs';

@Injectable({providedIn: 'root'})
export class SettingRepository extends BaseApiRepository {

    constructor(injector: Injector) {
        super(injector, injector.get(BASE_URL_FRAMEWORK), 'Settings');
    }

    get(key: string): Observable<QueryResult<any>> {
        return this.http.get<QueryResult<Setting>>(`${key}`).pipe(map(res => {
            return {
                ...res,
                data: (res.data?.value ? JSON.parse(res.data.value) : null)
            }
        }));
    }


    getAll(keys: string[] = []) {
        return this.http.get<QueryResult<Setting[]>>(``, {params: {keys}});
    }

    save(key: string, value: any) {
        const obj: any = {};
        obj[key] = value;
        return this.http.post<CommandResult>(``, obj);
    }

    saveAll(values: any) {
        return this.http.post<CommandResult>(``, values);
    }
}
