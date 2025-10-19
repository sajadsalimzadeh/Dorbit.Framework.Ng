import { BehaviorSubject, Subject } from "rxjs";
import { HubConnection, HubConnectionBuilder, HubConnectionState } from "@microsoft/signalr";
import { IDisposable } from '../contracts/dispose';
import { logger } from '../utils/log';

export class BaseHubService<TSendMethod, TReceiveMethod> implements IDisposable {

    $connection = new BehaviorSubject<HubConnection>(null as any);
    $state = new BehaviorSubject<HubConnectionState>(HubConnectionState.Disconnected);
    $connected = new BehaviorSubject<boolean>(false);

    private listeners: Map<TReceiveMethod, Subject<any>> = new Map();

    constructor(private url: string, private methodNames: TReceiveMethod[]) {

        this.$state.subscribe((status) => {
            logger.debug(`Hub status change ${status}`, { scope: 'hub' });
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
            .withUrl(`${this.url}`, { accessTokenFactory: () => token })
            .withAutomaticReconnect()
            .withKeepAliveInterval(1000)
            // .withServerTimeout(5000)
            .build();

        this.$state.next(connection.state);

        connection.start().then(() => {
            this.$state.next(connection.state);
            this.$connected.next(true);
        });
        connection.onclose(() => {
            this.$state.next(connection.state);
            this.$connected.next(false);
        });
        connection.onreconnecting(() => {
            this.$state.next(connection.state);
        });
        connection.onreconnected(() => {
            this.$state.next(connection.state);
            this.$connected.next(true);
        });

        this.$connection.next(connection);
        this.init();
    }

    init() {
        for (const key in this.listeners) {
            this.on(key as TReceiveMethod);
        }
    }

    dispose(): Promise<void> {
        return Promise.resolve(this.$connection.value?.stop());
    }

    on<T = any>(name: TReceiveMethod): Subject<T> {
        if (!this.listeners.has(name)) {
            this.listeners.set(name, new Subject<any>());
            
            this.$connection.value?.on(name as string, (data) => {
                const obj = (typeof data === 'string' ? JSON.parse(data) : data);
                this.listeners.get(name)?.next(obj);
            });
        }
        return this.listeners.get(name) as Subject<T>;
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
