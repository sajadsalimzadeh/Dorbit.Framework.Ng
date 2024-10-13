import {Observable} from "rxjs";

export class PromiseUtil{
  static fromObservable<T>(ob: Observable<T>) {
    return new Promise<T>((resolve,reject) => {
      ob.subscribe({
        next: resolve,
        error: reject,
      })
    })
  }
}
