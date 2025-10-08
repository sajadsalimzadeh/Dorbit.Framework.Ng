import { InjectionToken, Injector } from "@angular/core";
import { CancellationToken } from "../contracts";
import { delay } from "../utils";
import { Subscription } from "rxjs";

export const WORKER = new InjectionToken<WorkerService>('WORKER');
export const WORKER_WITH_INTERVAL = new InjectionToken<WorkerWithInterval>('WORKER_WITH_INTERVAL');

export abstract class WorkerService {
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

export abstract class WorkerWithInterval {
    private cancellationToken = new CancellationToken();

    subscription = new Subscription();

    constructor(protected injector: Injector, private interval: number) {
    }

    async start() {
        await this.stop();
        this.subscription = new Subscription();
        const cancellationToken = this.cancellationToken = new CancellationToken();
        while (!cancellationToken.isRequested) {
            try {
                await this.invoke();
                await delay(this.interval);
            }
            catch (e) {
                console.error(e)
            } finally {
            }
        }
    }

    async stop() {
        this.subscription.unsubscribe();
        this.cancellationToken?.cancel();
    }

    abstract invoke(): Promise<void>;
}