
import { Translation } from "@framework/contracts/translation";
import { HashUtil } from "./hash";

export class TranslateUtil {

    static getKey(payload: string) {
        return HashUtil.md5(payload);
    }

    static translate(translations: Translation[], payload: string, locale: string) {
        const key = this.getKey(payload);
        const translation = translations.find(x => x.key === key && x.locale === locale);
        if (translation) {
            return translation.value;
        }
        return payload;
    }
}