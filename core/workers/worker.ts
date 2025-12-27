import { InjectionToken, Injector } from "@angular/core";
import { Subscription } from "rxjs";

export const WORKER = new InjectionToken<Worker>('WORKER');

export abstract class Worker {
    subscription = new Subscription();

    constructor(protected injector: Injector) {
    }

    async start() {
        this.subscription = new Subscription();
        await this.invoke();
    }

    async stop() {
        this.subscription.unsubscribe();
    }

    abstract invoke(): Promise<void>;
}
