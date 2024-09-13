import {Injectable, Injector} from '@angular/core';
import {BaseApiRepository, CancellationToken, delay, QueryResult} from "@framework";
import {JobDto, JobLogDto} from "../contracts";
import {Observable} from "rxjs";

@Injectable({providedIn: 'root'})
export class JobRepository extends BaseApiRepository {


  constructor(injector: Injector) {
    super(injector, 'Jobs');
  }

  getAll() {
    return this.http.get<QueryResult<JobDto[]>>('');
  }

  watchAll(cancellationToken: CancellationToken) {
    return new Observable<any>(ob => {
      new Promise(async () => {
        while (!cancellationToken.isRequested) {
          const res = await fetch(this.getUrl('Watch'));
          const reader = await res.body?.getReader();
          if (reader) {
            let data = await reader.read();
            while (!data.done && !ob.closed && !cancellationToken.isRequested) {
              try {
                data = await reader.read();
                if (data.value) {
                  const value = new TextDecoder().decode(data.value);
                  const json = value.substring(value.indexOf('{'), value.lastIndexOf('}') + 1);
                  json.replaceAll('},{','}},{{').split('},{').forEach(x => {
                    try {
                      ob.next(JSON.parse(x));
                    } catch {
                    }
                  });
                }
              } catch {
                await delay(100)
              }
            }
          }
        }
      }).finally(() => ob.complete())

    });
  }

  getAllLog(id: string, params?: any) {
    return this.http.get<QueryResult<JobLogDto[]>>(`${id}/Logs`, {params});
  }

  cancel(id: string) {
    return this.http.post<QueryResult<JobLogDto[]>>(`${id}/Cancel`, {});
  }

  pause(id: string) {
    return this.http.post<QueryResult<JobLogDto[]>>(`${id}/Pause`, {});
  }

  resume(id: string) {
    return this.http.post<QueryResult<JobLogDto[]>>(`${id}/Resume`, {});
  }

  download(id: string) {
    return this.http.post(`${id}/Download`, {}, {responseType: 'blob'});
  }
}
