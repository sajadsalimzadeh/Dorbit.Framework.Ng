import {IDisposable} from "../contracts";
import {Subscription} from "rxjs";

export interface IBackgroundWorker extends IDisposable{
  start(): Promise<void>;
}

export abstract class BackgroundWorker implements IBackgroundWorker {

  subscription = new Subscription();

  async start() {
    this.subscription = new Subscription();
    await this.startAsync();
  }

  abstract startAsync(): Promise<void>;

  dispose(): Promise<void> {
    return Promise.resolve(undefined);
  }
}
