import {HttpClient, HttpErrorResponse, HttpEvent, HttpHandler,
    HttpRequest,
    HttpResponse
} from "@angular/common/http";
import {TranslateService} from "@ngx-translate/core";
import {Injector} from "@angular/core";
import {catchError, finalize, Observable, tap, throwError} from "rxjs";
import {Colors} from "../types";
import {MessageService} from "../components/message/services/message.service";
import {Message} from "../components/message/models";

const messageTimes: { [key: string]: number } = {};

export abstract class BaseApiRepository {

    public readonly baseUrl: string;
    public readonly repository: string;
    public messagingEnabled: boolean = true;
    protected http: CustomHttpClient;
    protected handler: CustomHttpHandler;

    protected constructor(protected injector: Injector, baseUrl: string, repository: string) {
        this.baseUrl = baseUrl;
        this.repository = repository;
        this.handler = new CustomHttpHandler(injector, this);
        this.http = new CustomHttpClient(this.handler);
    }

    get isLoading() {
        return this.handler.isLoading;
    }

    getUrl(url: string) {
        return `${this.baseUrl}${(this.baseUrl.endsWith('/') ? '' : '/')}${this.repository}/${url}`;
    }
}

class CustomHttpHandler extends HttpHandler {
    private progressCount = 0;
    private readonly handler: HttpHandler;
    private readonly translateService: TranslateService;
    private readonly messageService: MessageService;

    constructor(
        injector: Injector,
        private api: BaseApiRepository) {
        super();
        this.handler = injector.get(HttpHandler)
        this.translateService = injector.get(TranslateService)
        this.messageService = injector.get(MessageService)
    }

    get isLoading() {
        return this.progressCount > 0;
    }

    override handle(req: HttpRequest<any>): Observable<HttpEvent<any>> {

        if (!req.url.startsWith('http')) {

            let url = req.url;
            if (url.startsWith('$')) {
                url = url.substring(1);
            } else {
                let baseUrl = this.api.baseUrl;
                if (url.startsWith('~')) {
                    url = url.substring(1);
                } else if (this.api.repository) {
                    baseUrl += (baseUrl.endsWith('/') ? '' : '/') + this.api.repository;
                }
                if (!baseUrl.endsWith('/')) baseUrl += '/';
                url = baseUrl + (url.startsWith('/') ? url.substring(1) : url);

                if (url.endsWith('/')) url = url.substring(0, url.length - 1);
            }

            req = req.clone({
                url: url
            });
        }

        this.progressCount++;
        return this.handler.handle(req).pipe(finalize(() => {
            this.progressCount--;
        })).pipe(tap(e => {
            if (e instanceof HttpResponse) {
                if (e.ok) {
                    if (e.body.message) {
                        this.send(`message.${e.body.message}`, 'success');
                    } else if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method.toUpperCase())) {
                        // this.send(`message.success`, 'success');
                    }
                }
            }
        })).pipe(catchError(e => {
            if (e instanceof HttpErrorResponse) {
                if (e.error?.message) {
                    this.send(`message.${e.error.message}`, 'danger', undefined, e.error.data);
                } else if (e.status == 504 || e.status == 0) {
                    this.send(`message.http.504`, 'danger', {duration: 10000});
                } else {
                    this.send(`message.error`, 'danger');
                }
            }

            return throwError(() => e)
        }));
    }

    private send(text: string, color: Colors, message?: Message, data?: any) {
        if (this.api.messagingEnabled) {
            const key = `${text}`;
            if (Date.now() - messageTimes[key] < 1000) return;
            let translate = this.translateService.instant(key);
            if (translate == key) {
                console.warn(`translate '${translate}' not exists`)
                return;
            }
            if (data) {
                for (const dataKey in data) {
                    translate = translate.replace(`{${dataKey}}`, data[dataKey]);
                }
            }
            this.messageService.show({
                duration: 7000,
                ...message,
                body: translate,
                color: color,
            });
            messageTimes[key] = Date.now();
        }
    }
}

class CustomHttpClient extends HttpClient {
    private customHandler: CustomHttpHandler;

    constructor(handler: CustomHttpHandler) {
        super(handler);
        this.customHandler = handler;
    }

}
