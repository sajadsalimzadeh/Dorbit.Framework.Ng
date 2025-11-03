export class MobileUtil {

    static sms(number: string, text: string) {
        return this.openApp([number], text);
    }

    static call(number: string) {
        return this.openApp([number]);
    }

    private static openApp(args: any[], body?: string) {
        const ua = window.navigator.userAgent.toLowerCase();
        if (ua.includes('iphone') || ua.includes('android')) {
            const ch = (ua.includes('iphone') ? '&' : '?');
            window.open(`sms://${args.join('/')}${body ? '/' + ch + 'body=' + encodeURIComponent(body) : ''}`, '_blank');
            return true;
        }
        return false;
    }
}
