import {Injectable, Injector} from '@angular/core';
import {BaseApiRepository} from "./base-api.repository";
import {CommandResult, QueryResult} from "../contracts";
import {NotificationRecord} from "../stores";

interface NotificationDto {
  title?: string | null;
  subTitle?: string | null;
  body?: string | null;
  icon?: string | null;
  badge?: string | null;
  image?: string | null;
}

@Injectable({providedIn: 'root'})
export class NotificationRepository extends BaseApiRepository {


  constructor(injector: Injector) {
    super(injector, 'Notifications');
  }

  getAll() {
    return this.http.get<QueryResult<NotificationRecord[]>>('');
  }

  last() {
    return this.http.get<QueryResult<NotificationRecord>>('Last');
  }

  send(req: {userIds: string[], notification: NotificationDto}) {
    return this.http.post<CommandResult>('', req);
  }

  empty() {
    return this.http.post<CommandResult>('Empty', {});
  }

  delete(id: string) {
    return this.http.delete<CommandResult>('' + id);
  }
}
