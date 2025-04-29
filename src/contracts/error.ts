import {Message} from '../components/message/models';
import {Colors} from '../types';

export class MessageError implements Error {
    static Name = 'MessageError';

    readonly options?: Message;
    readonly color: Colors;
    readonly message: string;
    readonly name: string;
    readonly params: any;

    constructor(message: string, color: Colors = 'danger', options?: Message, params?: any) {
        this.message = message;
        this.color = color;
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
