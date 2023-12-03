import {BehaviorSubject} from "rxjs";

class InternetStateService {

  $status = new BehaviorSubject(window.navigator.onLine);

  constructor() {
    window.addEventListener('online', () => this.$status.next(true));
    window.addEventListener('offline', () => this.$status.next(false));
  }
}

export const internetStateService = new InternetStateService();
