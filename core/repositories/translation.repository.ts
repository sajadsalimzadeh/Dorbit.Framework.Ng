import { Injectable, Injector } from "@angular/core";
import { Translation } from "@framework/contracts/translation";
import { BASE_API_URL_FRAMEWORK } from "@framework/configs";
import { QueryResult } from "@framework/contracts";
import { BaseApiRepository } from "@framework/repositories";
import { tap } from "rxjs";
import { TranslateUtil } from "@app/utils/translate";

@Injectable({
    providedIn: 'root'
})
export class TranslationRepository extends BaseApiRepository {

    translations: Record<string, string> = {};

    constructor(injector: Injector) {
        super(injector, injector.get(BASE_API_URL_FRAMEWORK) , 'Translations');
    }

    getAll(locale: string, keys: string[] = []) {
        return this.http.post<QueryResult<Translation[]>>(`${locale}`, keys).pipe(tap(res => {
            res.data?.forEach(x => {
                this.translations[x.key] = x.value;
            });
        }));
    }

    translate(value: string) {
        const key = TranslateUtil.getKey(value)
        return this.translations[key] ?? value;
    }
}