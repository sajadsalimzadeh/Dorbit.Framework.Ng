import {Injectable, Injector} from '@angular/core';
import {BaseApiRepository} from "../services";
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

  send(req: {userIds: string[], notification: NotificationDto, test: boolean}) {
    return this.http.post<CommandResult>('', req);
  }
}
