import {Injectable, Injector} from '@angular/core';
import {BaseApiRepository, QueryResult} from "@framework";

@Injectable({providedIn: 'root'})
export class FileRepository extends BaseApiRepository {

  constructor(injector: Injector) {
    super(injector, 'Files');
  }

  upload(file: File) {
    const formData = new FormData();
    formData.append('file', file,  file.name);
    return this.http.post<QueryResult<string>>('', formData)
  }
}
