export class MobileUtil {

    static sms(number: string, text: string) {
        const ua = window.navigator.userAgent.toLowerCase();
        if (ua.includes('iphone') || ua.includes('android')) {
            const ch = (ua.includes('iphone') ? '&' : '?');
            return `sms://${number}${text ? '/' + ch + 'body=' + encodeURIComponent(text) : ''}`;
        }
        return null;
    }

    static call(number: string) {
        return `tel:${number}`;
    }

    private static createUrl(args: any[], body?: string) {
    }
}
