import {Observable} from 'rxjs';

export class ObservableUtil {

    static toObservable<T>(ob: Observable<T>) {
        return new Promise<T>((resolve, reject) => {
            ob.subscribe({
                next: resolve,
                error: reject,
            })
        })
    }

    static toPromiseComplete(ob: Observable<any>) {
        return new Promise<void>((resolve, reject) => {
            ob.subscribe({
                complete: resolve,
                error: reject,
            })
        })
    }
}
