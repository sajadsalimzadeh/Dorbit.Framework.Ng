import {BehaviorSubject, Subject} from "rxjs";
import {HubConnection, HubConnectionBuilder, HubConnectionState} from "@microsoft/signalr";
import {IDisposable} from '../contracts/dispose';
import {logger} from '../utils/log';

export class BaseHubService<TSendMethod, TReceiveMethod> implements IDisposable {

    $connection = new BehaviorSubject<HubConnection>(null as any);
    $state = new BehaviorSubject<HubConnectionState>(HubConnectionState.Disconnected);

    private listens: { [key: string]: Subject<any> } = {};

    constructor(private url: string, private methodNames: TReceiveMethod[]) {

        this.$state.subscribe((status) => {
            logger.debug(`Hub status change ${status}`, {scope: 'hub'});
        })
    }

    connect(token: string) {
        if (!token) {
            return;
        }
        if (this.$connection.value && this.$connection.value.state !== HubConnectionState.Disconnected) {
            return;
        }
        const connection = new HubConnectionBuilder()
            .withUrl(`${this.url}`, {accessTokenFactory: () => token})
            .withAutomaticReconnect()
            .withKeepAliveInterval(1000)
            // .withServerTimeout(5000)
            .build();

        this.$state.next(connection.state);

        connection.start().then(() => {
            this.$state.next(connection.state);
        });
        connection.onclose(() => {
            this.$state.next(connection.state);
        });
        connection.onreconnecting(() => {
            this.$state.next(connection.state);
        });
        connection.onreconnected(() => {
            this.$state.next(connection.state);
        });

        for (const method of this.methodNames) {
            const listens = this.listens as any;
            listens[method] ??= new Subject()
            connection.on(method as string, (data) => {
                const obj = (typeof data === 'string' ? JSON.parse(data) : data);
                listens[method].next(obj);
            });
        }

        this.$connection.next(connection);
    }

    dispose(): Promise<void> {
        return Promise.resolve(this.$connection.value?.stop());
    }

    on<T = any>(name: TReceiveMethod): Subject<T> {
        const listeners = this.listens as any;
        if (!listeners[name]) listeners[name] = new Subject<any>();
        return listeners[name];
    }

    protected async send<T>(method: TSendMethod, mode: 'send' | 'invoke', ...data: any[]) {
        if (this.$connection.value) {
            if (mode == 'send') {
                await this.$connection.value.send(method as string, ...data);
                return null;
            }
            return await this.$connection.value.invoke<T>(method as string, ...data)
        } else {
            throw new Error('connection not made')
        }
    }
}
