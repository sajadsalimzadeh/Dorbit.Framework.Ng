import {Injectable} from '@angular/core';
import {Subject} from "rxjs";

@Injectable({providedIn: 'root'})
export class LoadingService {
  private counters = 0;

  get loading() {return this.counters > 0;}

  onLoading = new Subject<boolean>();

  startLoading() {
    this.counters++;
    this.onLoading.next(this.counters > 0);
  }

  endLoading() {
    this.counters--;
    this.onLoading.next(this.counters > 0);
  }
}
