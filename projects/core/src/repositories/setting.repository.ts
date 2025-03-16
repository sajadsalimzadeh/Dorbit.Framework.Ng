import {Injectable, Injector} from '@angular/core';
import {BaseApiRepository, CommandResult, QueryResult} from "@framework";

@Injectable({providedIn: 'root'})
export class SettingRepository extends BaseApiRepository {

  constructor(injector: Injector) {
    super(injector, 'Settings');
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
