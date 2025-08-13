import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Inject, Injectable, Injector } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { MessageService } from "primeng/api";
import { Observable, tap } from "rxjs";

@Injectable({ providedIn: 'root' })
export class MessageInterceptor implements HttpInterceptor {

    messageHistory: { [key: string]: number } = {};

    constructor(private injector: Injector) {
    }

    showMessage(message: string) {
        const now = Date.now();
        if(now - this.messageHistory[message] < 1000) return;
        this.messageHistory[message] = now;
        const translateService = this.injector.get(TranslateService);
        const messageService = this.injector.get(MessageService);
        messageService.add({
            severity: 'error',
            detail: translateService.instant(message),
        })
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        return next.handle(req).pipe(tap({
            error: (err) => {
                if (err instanceof HttpErrorResponse) {

                    if(err.status == 403) {
                        this.showMessage('message.UnAuthorize');
                    }
                    else if (req.method != 'GET' && err.error?.message) {
                        const message = err.error.message;
                        this.showMessage('message.' + message);
                    } else {
                        this.showMessage('message.operation-error');
                    }
                }
            }
        }))
    }
}