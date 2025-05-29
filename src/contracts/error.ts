import {Message} from '../components/message/models';
import {MessageSeverity} from './severity';

export class MessageError implements Error {
    static Name = 'MessageError';

    readonly options?: Message;
    readonly severity: MessageSeverity;
    readonly message: string;
    readonly name: string;
    readonly params: any;

    constructor(message: string, color: MessageSeverity = 'error', options?: Message, params?: any) {
        this.message = message;
        this.severity = color;
        this.options = options;
        this.name = MessageError.Name;
        this.params = params;
    }
}

export class NotImplementError implements Error {
    readonly message: string;
    readonly name: string = 'NotImplementError';

    constructor(message?: string) {
        this.message = message ?? '';
    }
}
