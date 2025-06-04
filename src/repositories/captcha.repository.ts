import {Injectable, Injector} from "@angular/core";
import {QueryResult} from '../contracts/results';
import {CaptchaResponse} from '../contracts/captcha';
import {BASE_URL_FRAMEWORK} from '../configs';
import {BaseApiRepository} from './base-api.repository';

@Injectable({providedIn: 'root'})
export class CaptchaRepository extends BaseApiRepository {
    constructor(injector: Injector) {
        super(injector, injector.get(BASE_URL_FRAMEWORK), 'Captchas');
    }

    get(width: number, height: number) {
        return this.http.get<QueryResult<CaptchaResponse>>(``, {params: {width, height}})
    }
}
