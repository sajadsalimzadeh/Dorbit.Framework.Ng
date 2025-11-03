import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Inject, Injectable, Injector, isDevMode } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { MessageService } from "primeng/api";
import { Observable, tap } from "rxjs";

@Injectable({ providedIn: 'root' })
export class MessageInterceptor implements HttpInterceptor {

    messageHistory: { [key: string]: number } = {};

    constructor(private injector: Injector) {
    }

    showMessage(message: string, data?: any) {
        const now = Date.now();
        if (now - this.messageHistory[message] < 1000) return;
        this.messageHistory[message] = now;
        const translateService = this.injector.get(TranslateService);
        const messageService = this.injector.get(MessageService);
        const tralatedMessage = translateService.instant(message, data);

        if (tralatedMessage != message || !isDevMode()) {

            messageService.add({
                severity: 'error',
                detail: tralatedMessage,
            })
        }
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        return next.handle(req).pipe(tap({
            error: (err) => {
                if (err instanceof HttpErrorResponse) {

                    if (err.error?.message) {
                        const message = err.error.message;
                        this.showMessage('message.' + message, err.error.data);
                    }
                    else if (err.status == 400) {
                        this.showMessage('message.http.BadRequest');
                    }
                    else if (err.status == 401) {
                        this.showMessage('message.http.UnAuthenticated');
                    }
                    else if (err.status == 403) {
                        this.showMessage('message.http.UnAuthorize');
                    }
                    else if (err.status == 404) {
                        this.showMessage('message.http.NotFound');
                    }
                    else if (err.status == 500) {
                        this.showMessage('message.http.InternalServerError');
                    }
                    else if (err.status == 502) {
                        this.showMessage('message.http.BadGateway');
                    }
                    else if (err.status == 503) {
                        this.showMessage('message.http.ServiceUnavailable');
                    }
                    else if (err.status == 504) {
                        this.showMessage('message.http.GatewayTimeout');
                    }
                    else {
                        this.showMessage('message.http.OperationError');
                    }
                }
            }
        }))
    }
}