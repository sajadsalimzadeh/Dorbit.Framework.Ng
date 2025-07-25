import {Message} from '../components/message/models';
import {Severity} from '../../primeng/contracts/severity';

export class MessageError implements Error {
    static Name = 'MessageError';

    readonly options?: Message;
    readonly severity: Severity;
    readonly message: string;
    readonly name: string;
    readonly params: any;

    constructor(message: string, color: Severity = 'error', options?: Message, params?: any) {
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
