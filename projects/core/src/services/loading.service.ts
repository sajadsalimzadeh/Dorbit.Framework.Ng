import {Injectable} from '@angular/core';
import {BehaviorSubject} from "rxjs";

@Injectable({providedIn: 'root'})
export class LoadingService {
    $loading = new BehaviorSubject<boolean>(false);
    private counters = 0;

    get loading() {
        return this.counters > 0;
    }

    start() {
        this.counters++;
        this.$loading.next(this.counters > 0);
    }

    end() {
        this.counters--;
        this.$loading.next(this.counters > 0);
    }
}
