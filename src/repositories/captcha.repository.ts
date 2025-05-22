import {HttpClient} from "@angular/common/http";
import {QueryResult} from "../contracts/response";
import {CaptchaResponse} from "../contracts/captcha";
import {BASE_API_URL} from "../../configs";
import {Injectable} from "@angular/core";

@Injectable({providedIn: 'root'})
export class CaptchaRepository {
    constructor(private http: HttpClient) {

    }

    get(width: number, height: number) {
        return this.http.get<QueryResult<CaptchaResponse>>(`${BASE_API_URL}/Captchas`, {params: {width, height}})
    }
}
