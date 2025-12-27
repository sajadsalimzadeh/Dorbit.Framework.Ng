import { CancellationToken } from "@framework/contracts";
import { Subscription } from "rxjs";
import { delay } from "@framework/utils";
import { Injector, InjectionToken } from "@angular/core";

export const WORKER_WITH_INTERVAL = new InjectionToken<WorkerWithInterval>('WORKER_WITH_INTERVAL');

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