import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Inject, Injectable, Injector } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { MessageService } from "primeng/api";
import { Observable, tap } from "rxjs";

@Injectable({ providedIn: 'root' })
export class MessageInterceptor implements HttpInterceptor {

    constructor(private injector: Injector) {
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        return next.handle(req).pipe(tap({
            error: (err) => {
                if (req.method == 'POST' && err instanceof HttpErrorResponse) {
                    if (!err.error?.message) return;
                    const message = err.error.message;
                    const translateService = this.injector.get(TranslateService);
                    const messageService = this.injector.get(MessageService);
                    const translatedMessage = translateService.instant('message.' + message);
                    messageService.add({
                        severity: 'error',
                        detail: translatedMessage,
                    })
                }
            }
        }))
    }
}