import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {QueryResult} from '../contracts/results';
import {CaptchaResponse} from '../contracts/captcha';
import {BASE_FRAMEWORK_URL} from '../framework';

@Injectable({providedIn: 'root'})
export class CaptchaRepository {
    constructor(private http: HttpClient) {

    }

    get(width: number, height: number) {
        return this.http.get<QueryResult<CaptchaResponse>>(`${BASE_FRAMEWORK_URL}/Captchas`, {params: {width, height}})
    }
}
