import { BehaviorSubject, Subject } from "rxjs";
import { HubConnection, HubConnectionBuilder, HubConnectionState } from "@microsoft/signalr";
import { IDisposable } from '../contracts/dispose';
import { logger } from '../utils/log';

export class BaseHubService<TSendMethod, TReceiveMethod> implements IDisposable {
    $state = new BehaviorSubject<HubConnectionState>(HubConnectionState.Disconnected);
    $connected = new BehaviorSubject<boolean>(false);

    private connection?: HubConnection;

    private listeners: Map<TReceiveMethod, Subject<any>> = new Map();

    constructor(private url: string, private methodNames: TReceiveMethod[]) {

        this.$state.subscribe((status) => {
            logger.debug(`Hub status change ${status}`, { scope: 'hub' });
        })
    }

    connect(token: string) {
        if (!token) return;
        if (this.connection) return;
        const connection = new HubConnectionBuilder()
            .withUrl(`${this.url}`, { accessTokenFactory: () => token })
            .withAutomaticReconnect({ nextRetryDelayInMilliseconds: () => 1000 })
            .withKeepAliveInterval(1000)
            // .withServerTimeout(5000)
            .build();

        this.connection = connection;

        connection.onclose(() => {
            this.$connected.next(false);
            this.$state.next(connection.state);
        });
        connection.onreconnecting(() => {
            this.$connected.next(false);
            this.$state.next(connection.state);
        });
        connection.onreconnected(() => {
            this.$connected.next(true);
            this.$state.next(connection.state);
        });

        connection.start().then(() => {
            this.$connected.next(true);
            this.$state.next(connection.state);
        });

        this.init();
    }

    init() {
        for (const key in this.listeners) {
            this.on(key as TReceiveMethod);
        }
    }

    dispose(): Promise<void> {
        return Promise.resolve(this.connection?.stop());
    }

    on<T = any>(name: TReceiveMethod): Subject<T> {
        if (!this.listeners.has(name)) {
            this.listeners.set(name, new Subject<any>());

            this.connection?.on(name as string, (data) => {
                const obj = (typeof data === 'string' ? JSON.parse(data) : data);
                this.listeners.get(name)?.next(obj);
            });
        }
        return this.listeners.get(name) as Subject<T>;
    }

    protected async send<T>(method: TSendMethod, mode: 'send' | 'invoke', ...data: any[]) {
        if (this.connection) {
            if (mode == 'send') {
                await this.connection.send(method as string, ...data);
                return null;
            }
            return await this.connection.invoke<T>(method as string, ...data)
        } else {
            throw new Error('connection not made')
        }
    }
}
