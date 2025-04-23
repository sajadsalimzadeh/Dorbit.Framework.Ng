const rtlLocales = ['fa']

export class LocaleUtil {

    static getDir(locale: string) {
        if (rtlLocales.includes(locale)) return 'rtl';
        return 'ltr';
    }
}
