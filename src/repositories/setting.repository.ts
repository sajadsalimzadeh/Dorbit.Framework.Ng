import {Inject, Injectable, Injector} from '@angular/core';
import {CommandResult, QueryResult} from "../contracts/command-result";
import {BaseApiRepository} from './base-api.repository';
import {BASE_FRAMEWORK_URL} from '../contracts/tokens';

@Injectable({providedIn: 'root'})
export class SettingRepository extends BaseApiRepository {

  constructor(injector: Injector, @Inject(BASE_FRAMEWORK_URL) baseUrl: string) {
    super(injector, baseUrl, 'Settings');
  }

  get(key: string) {
    return this.http.get<QueryResult>(`${key}`);
  }


  getAll(keys: string[]) {
    return this.http.get<QueryResult>(``, {params: {keys}});
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
