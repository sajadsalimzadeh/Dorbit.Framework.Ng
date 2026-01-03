import { Injectable, Injector } from "@angular/core";
import { Translation } from "@framework/contracts/translation";
import { BASE_URL_FRAMEWORK } from "@framework/configs";
import { QueryResult } from "@framework/contracts";
import { BaseApiRepository } from "@framework/repositories";

@Injectable({
    providedIn: 'root'
})
export class TranslationRepository extends BaseApiRepository {

    constructor(injector: Injector) {
        super(injector, injector.get(BASE_URL_FRAMEWORK) , 'Translations');
    }

    translateAll(locale: string, keys: string[]) {
        return this.http.post<QueryResult<Translation[]>>(``, keys, {params: {locale}});
    }
}