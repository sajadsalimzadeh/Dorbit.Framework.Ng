import {Injectable} from "@angular/core";
import {Subject} from "rxjs";
import {Message} from "../models";


@Injectable({providedIn: 'root'})
export class MessageService {
    onMessage = new Subject<Message>();

    options?: {
        default?: Message,
        primary?: Message,
        secondary?: Message,
        success?: Message,
        warning?: Message,
        danger?: Message,
        link?: Message,
    };

    show(message: Message) {
        message = {...this.options?.default, ...message};
        console.log(message.removable);
        
        message.removable ??= true;
        if (message.color?.includes('primary')) message = {...this.options?.primary, ...message};
        if (message.color?.includes('secondary')) message = {...this.options?.secondary, ...message};
        if (message.color?.includes('success')) message = {...this.options?.success, ...message};
        if (message.color?.includes('warning')) message = {...this.options?.warning, ...message};
        if (message.color?.includes('danger')) message = {...this.options?.danger, ...message};
        if (message.color?.includes('link')) message = {...this.options?.link, ...message};
        this.onMessage.next({...this.options, ...message});
    }

    warn(message: Message | string) {
        return this.show({...this.getMessage(message), color: 'warning'})
    }

    success(message: Message | string) {
        return this.show({...this.getMessage(message), color: 'success'})
    }

    error(message: Message | string) {
        return this.show({...this.getMessage(message), color: 'danger'})
    }

    info(message: Message | string) {
        return this.show({...this.getMessage(message), color: 'link'})
    }

    private getMessage(message: Message | string) {
        return (typeof message == 'string' ? {body: message} : message);
    }
}
