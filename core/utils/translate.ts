
import { Translation } from "@framework/contracts/translation";
import CryptoJS from "crypto-js";

export class TranslateUtil {

    static getKey(payload: string) {
        return CryptoJS.MD5(payload).toString();
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