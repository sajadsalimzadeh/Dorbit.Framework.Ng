import {BehaviorSubject} from "rxjs";

class InternetStateService {

  StatusChange = new BehaviorSubject(window.navigator.onLine);

  constructor() {
    window.addEventListener('online', () => this.StatusChange.next(true));
    window.addEventListener('offline', () => this.StatusChange.next(false));
  }
}

export const internetStateService = new InternetStateService();
