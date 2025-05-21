import {BehaviorSubject} from "rxjs";
import {indexedDbCacheService} from "./cache.service";

class InternetStateService {

    $status = new BehaviorSubject(window.navigator.onLine);

    constructor() {
        window.addEventListener('online', () => this.$status.next(true));
        window.addEventListener('offline', () => this.$status.next(false));
    }

    async reload() {
        if (this.$status.value) {
            await indexedDbCacheService.removeAll();
            const keys = await caches.keys();
            for (const key of keys) {
                await caches.delete(key)
            }
        }
        if (this.$status.value) {
            (location as any).reload(true);
        } else {
            location.reload();
        }
    }
}

export const internetStateService = new InternetStateService();
