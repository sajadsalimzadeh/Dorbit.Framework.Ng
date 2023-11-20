import {IDisposable} from "@dorbit";
import {Subscription} from "rxjs";

export interface IBackgroundWorker extends IDisposable{
  start(): Promise<void>;
}

export abstract class BackgroundWorker implements IBackgroundWorker {

  subscription = new Subscription();

  async start() {
    await this.dispose();
    this.subscription = new Subscription();
    await this.startAsync();
  }

  abstract startAsync(): Promise<void>;

  dispose(): Promise<void> {
    return Promise.resolve(undefined);
  }
}
